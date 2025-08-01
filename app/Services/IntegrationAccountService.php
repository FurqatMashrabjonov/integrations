<?php

namespace App\Services;

use App\Enums\IntegrationEnum;
use App\Models\IntegrationAccount;
use App\Services\Integrations\FitbitService;
use App\Services\Integrations\GithubService;
use App\Services\Integrations\WakapiService;
use Illuminate\Database\Eloquent\Collection;
use App\Services\Integrations\LeetcodeService;
use App\Repositories\Contracts\IntegrationAccountRepositoryInterface;

class IntegrationAccountService
{
    public function __construct(
        protected IntegrationAccountRepositoryInterface $repository,
        protected LeetcodeService $leetcodeService,
        protected FitbitService $fitbitService,
        protected GithubService $githubService,
        protected WakapiService $wakapiService
    ) {}

    public function getByUserAndIntegration(int $userId, IntegrationEnum $integration): ?IntegrationAccount
    {
        return $this->repository->findByUserAndIntegration($userId, $integration);
    }

    public function getUserIntegrations(int $userId): Collection
    {
        return $this->repository->findByUser($userId);
    }

    public function createOrUpdateAccount(
        int $userId,
        IntegrationEnum $integration,
        ?string $displayName = null,
        ?string $fullName = null,
        ?string $avatar = null,
        array $data = []
    ): IntegrationAccount {
        return $this->repository->createOrUpdate([
            'user_id'      => $userId,
            'integration'  => $integration,
            'display_name' => $displayName,
            'full_name'    => $fullName,
            'avatar'       => $avatar,
            'data'         => $data,
        ]);
    }

    public function syncAccountData(
        int $userId,
        IntegrationEnum $integration,
        array $responseData,
        ?string $displayName = null,
        ?string $fullName = null,
        ?string $avatar = null
    ): IntegrationAccount {
        return $this->repository->createOrUpdate([
            'user_id'      => $userId,
            'integration'  => $integration,
            'display_name' => $displayName ?? $this->extractDisplayName($integration, $responseData),
            'full_name'    => $fullName ?? $this->extractFullName($integration, $responseData),
            'avatar'       => $avatar ?? $this->extractAvatar($integration, $responseData),
            'data'         => $responseData,
        ]);
    }

    public function removeIntegration(int $userId, IntegrationEnum $integration): bool
    {
        return $this->repository->delete($userId, $integration);
    }

    public function removeAllUserIntegrations(int $userId): bool
    {
        return $this->repository->deleteByUser($userId);
    }

    private function extractDisplayName(IntegrationEnum $integration, array $data): ?string
    {
        return match ($integration) {
            IntegrationEnum::GITHUB => $data['login'] ?? null,
            IntegrationEnum::LEETCODE, IntegrationEnum::WAKAPI => $data['username'] ?? null,
            IntegrationEnum::FITBIT => $data['displayName'] ?? null,
        };
    }

    private function extractFullName(IntegrationEnum $integration, array $data): ?string
    {
        return match ($integration) {
            IntegrationEnum::GITHUB   => $data['name'] ?? null,
            IntegrationEnum::LEETCODE => $data['realName'] ?? null,
            IntegrationEnum::FITBIT   => $data['fullName'] ?? null,
            IntegrationEnum::WAKAPI   => $data['full_name'] ?? null,
        };
    }

    private function extractAvatar(IntegrationEnum $integration, array $data): ?string
    {
        return match ($integration) {
            IntegrationEnum::GITHUB => $data['avatar_url'] ?? null,
            IntegrationEnum::LEETCODE, IntegrationEnum::FITBIT => $data['avatar'] ?? null,
            IntegrationEnum::WAKAPI => $data['photo'] ?? null,
        };
    }

    /**
     * Sync LeetCode profile data
     */
    public function syncLeetcodeProfile(int $userId): void
    {
        $account = $this->getByUserAndIntegration($userId, IntegrationEnum::LEETCODE);

        if (!$account) {
            throw new \Exception('Leetcode account not found for user');
        }

        $username = $account->data['username'] ?? $account->display_name;
        if (!$username) {
            throw new \Exception('Username not found in account data');
        }

        // Fetch profile and recent submissions using the service
        $profile = $this->leetcodeService->getUser($username);
        $recent  = $this->leetcodeService->getUserRecentSubmissions($username)->toArray();

        // Update account with profile data
        $this->repository->createOrUpdate([
            'user_id'      => $userId,
            'integration'  => IntegrationEnum::LEETCODE,
            'display_name' => $username,
            'full_name'    => $profile->real_name,
            'avatar'       => $profile->user_avatar,
            'data'         => [
                'username'       => $username,
                'profile'        => $profile,
                'recent'         => $recent,
                'last_synced_at' => now()->toISOString(),
            ],
        ]);
    }

    /**
     * Get LeetCode profile data
     */
    public function getLeetcodeProfile(int $userId): ?array
    {
        $account = $this->getByUserAndIntegration($userId, IntegrationEnum::LEETCODE);

        if (!$account || !isset($account->data['profile'])) {
            return null;
        }

        return [
            'profile'        => $account->data['profile'],
            'recent'         => $account->data['recent'] ?? [],
            'last_synced_at' => $account->data['last_synced_at'] ?? null,
        ];
    }

    /**
     * Sync Fitbit profile data
     */
    public function syncFitbitProfile(int $userId): void
    {
        $account = $this->getByUserAndIntegration($userId, IntegrationEnum::FITBIT);

        if (!$account) {
            throw new \Exception('Fitbit account not found for user');
        }

        $displayName = $account->display_name;
        if (!$displayName) {
            throw new \Exception('Display name not found in account data');
        }

        // Fetch steps and activity data using the service
        $todaySteps = $this->fitbitService->getUserStepsAndStore($userId);
        $weekSteps  = $this->getWeeklySteps($userId);

        // Calculate distance (rough estimate: 1 step = 0.0008 km)
        $todayDistance = round(($todaySteps * 0.0008), 1);

        // Update account with profile data
        $this->repository->createOrUpdate([
            'user_id'      => $userId,
            'integration'  => IntegrationEnum::FITBIT,
            'display_name' => $account->display_name,
            'full_name'    => $account->full_name,
            'avatar'       => $account->avatar,
            'data'         => [
                'display_name'   => $displayName,
                'today_steps'    => $todaySteps,
                'today_distance' => $todayDistance,
                'week_steps'     => $weekSteps,
                'last_synced_at' => now()->toISOString(),
            ],
        ]);
    }

    /**
     * Get Fitbit profile data
     */
    public function getFitbitProfile(int $userId): ?array
    {
        $account = $this->getByUserAndIntegration($userId, IntegrationEnum::FITBIT);

        if (!$account || !isset($account->data['today_steps'])) {
            return null;
        }

        return [
            'display_name'   => $account->data['display_name'] ?? $account->display_name,
            'today_steps'    => $account->data['today_steps'] ?? 0,
            'today_distance' => $account->data['today_distance'] ?? 0,
            'week_steps'     => $account->data['week_steps'] ?? 0,
            'last_synced_at' => $account->data['last_synced_at'] ?? null,
            'avatar'         => $account->avatar,
        ];
    }

    /**
     * Get weekly steps (simplified - would need more complex logic in real implementation)
     */
    private function getWeeklySteps(int $userId): int
    {
        // This is a simplified implementation
        // In reality, you'd fetch data for each day of the week
        try {
            return $this->fitbitService->getUserStepsAndStore($userId) * 7; // Rough estimate
        } catch (\Exception $e) {
            return 0;
        }
    }

    /**
     * Sync GitHub profile data
     */
    public function syncGithubProfile(int $userId): void
    {
        $account = $this->getByUserAndIntegration($userId, IntegrationEnum::GITHUB);

        if (!$account) {
            throw new \Exception('GitHub account not found for user');
        }

        $displayName = $account->display_name;
        if (!$displayName) {
            throw new \Exception('Display name not found in account data');
        }

        try {
            // Fetch GitHub activities and store them
//            $this->githubService->getActivitiesAndStore($userId);

            // For now, we'll use mock data similar to what's in the UI
            $todayCommits = 15421; // This would come from actual GitHub API
            $todayPRs     = 2321;     // This would come from actual GitHub API
            $weekCommits  = 25;  // This would come from actual GitHub API
            $weekPRs      = 8;      // This would come from actual GitHub API

            // Update account with profile data
            $this->repository->createOrUpdate([
                'user_id'      => $userId,
                'integration'  => IntegrationEnum::GITHUB,
                'display_name' => $account->display_name,
                'full_name'    => $account->full_name,
                'avatar'       => $account->avatar,
                'data'         => [
                    'display_name'   => $displayName,
                    'today_commits'  => $todayCommits,
                    'today_prs'      => $todayPRs,
                    'week_commits'   => $weekCommits,
                    'week_prs'       => $weekPRs,
                    'last_synced_at' => now()->toISOString(),
                ],
            ]);
        } catch (\Exception $e) {
            // If API fails, use cached data or defaults
            $this->repository->createOrUpdate([
                'user_id'      => $userId,
                'integration'  => IntegrationEnum::GITHUB,
                'display_name' => $account->display_name,
                'full_name'    => $account->full_name,
                'avatar'       => $account->avatar,
                'data'         => [
                    'display_name'   => $displayName,
                    'today_commits'  => 0,
                    'today_prs'      => 0,
                    'week_commits'   => 0,
                    'week_prs'       => 0,
                    'last_synced_at' => now()->toISOString(),
                    'error'          => 'Failed to fetch data: ' . $e->getMessage(),
                ],
            ]);
        }
    }

    /**
     * Get GitHub profile data
     */
    public function getGithubProfile(int $userId): ?array
    {
        $account = $this->getByUserAndIntegration($userId, IntegrationEnum::GITHUB);

        if (!$account) {
            return null;
        }

        return [
            'display_name'   => $account->data['display_name'] ?? $account->display_name,
            'today_commits'  => $account->data['today_commits'] ?? 0,
            'today_prs'      => $account->data['today_prs'] ?? 0,
            'week_commits'   => $account->data['week_commits'] ?? 0,
            'week_prs'       => $account->data['week_prs'] ?? 0,
            'last_synced_at' => $account->data['last_synced_at'] ?? null,
            'avatar'         => $account->avatar,
            'full_name'      => $account->full_name,
        ];
    }

    /**
     * Sync Wakapi profile data
     */
    public function syncWakapiProfile(int $userId): ?array
    {
        $account = $this->getByUserAndIntegration($userId, IntegrationEnum::WAKAPI);

        if (!$account || !isset($account->data['api_token'])) {
            return null;
        }

        try {
            // Get user profile and activities using stored API token
            $profile = $this->wakapiService->setToken($account->data['api_token'])->getUser();
            $todayActivities = $this->wakapiService->setToken($account->data['api_token'])->getDailyActivities('today');
            $last7DaysActivities = $this->wakapiService->setToken($account->data['api_token'])->getDailyActivities('last_7_days');

            // Update account data
            $updatedData = array_merge($account->data, [
                'today_hours'        => round($todayActivities->total_seconds / 3600, 2),
                'today_seconds'      => $todayActivities->total_seconds,
                'week_hours'         => round($last7DaysActivities->total_seconds / 3600, 2),
                'week_seconds'       => $last7DaysActivities->total_seconds,
                'languages'          => $todayActivities->languages,
                'projects'           => $todayActivities->projects,
                'editors'            => $todayActivities->editors,
                'operating_systems'  => $todayActivities->operating_systems,
                'last_synced_at'     => now()->toISOString(),
            ]);

            // Update the account
            $this->repository->createOrUpdate([
                'user_id'      => $userId,
                'integration'  => IntegrationEnum::WAKAPI,
                'display_name' => $profile->username,
                'full_name'    => $profile->display_name,
                'avatar'       => $profile->photo,
                'data'         => $updatedData,
            ]);

            return $updatedData;
        } catch (\Exception $e) {
            \Log::error('Wakapi sync failed for user ' . $userId . ': ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get Wakapi profile data
     */
    public function getWakapiProfile(int $userId): ?array
    {
        $account = $this->getByUserAndIntegration($userId, IntegrationEnum::WAKAPI);

        if (!$account) {
            return null;
        }

        return [
            'display_name'       => $account->data['username'] ?? $account->display_name,
            'full_name'          => $account->full_name,
            'today_hours'        => $account->data['today_hours'] ?? 0,
            'today_seconds'      => $account->data['today_seconds'] ?? 0,
            'week_hours'         => $account->data['week_hours'] ?? 0,
            'week_seconds'       => $account->data['week_seconds'] ?? 0,
            'languages'          => $account->data['languages'] ?? [],
            'projects'           => $account->data['projects'] ?? [],
            'editors'            => $account->data['editors'] ?? [],
            'operating_systems'  => $account->data['operating_systems'] ?? [],
            'last_synced_at'     => $account->data['last_synced_at'] ?? null,
            'avatar'             => $account->avatar,
        ];
    }
}
