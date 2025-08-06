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

        // Fetch profile using the service (profile contains basic info, not daily stats)
        $profile = $this->leetcodeService->getUser($username);

        // Update account with profile data only (no stats)
        $this->repository->createOrUpdate([
            'user_id'      => $userId,
            'integration'  => IntegrationEnum::LEETCODE,
            'display_name' => $username,
            'full_name'    => $profile->real_name,
            'avatar'       => $profile->user_avatar,
            'data'         => [
                'username'       => $username,
                'connected_at'   => $account->data['connected_at'] ?? now()->toISOString(),
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

        if (!$account) {
            return null;
        }

        return [
            'username'       => $account->data['username'] ?? $account->display_name,
            'display_name'   => $account->display_name,
            'full_name'      => $account->full_name,
            'avatar'         => $account->avatar,
            'connected_at'   => $account->data['connected_at'] ?? null,
            'last_synced_at' => $account->data['last_synced_at'] ?? null,
            'error'          => $account->data['error'] ?? null,
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

        // Update account with profile data only (no stats)
        $this->repository->createOrUpdate([
            'user_id'      => $userId,
            'integration'  => IntegrationEnum::FITBIT,
            'display_name' => $account->display_name,
            'full_name'    => $account->full_name,
            'avatar'       => $account->avatar,
            'data'         => [
                'display_name'   => $displayName,
                'connected_at'   => $account->data['connected_at'] ?? now()->toISOString(),
                'last_synced_at' => now()->toISOString(),
            ],
        ]);

        // Note: Stats are stored in daily_stats table via CollectUserIntegrationData job
    }

    /**
     * Get Fitbit profile data (account info only, no stats)
     */
    public function getFitbitProfile(int $userId): ?array
    {
        $account = $this->getByUserAndIntegration($userId, IntegrationEnum::FITBIT);

        if (!$account) {
            return null;
        }

        return [
            'display_name'   => $account->data['display_name'] ?? $account->display_name,
            'last_synced_at' => $account->data['last_synced_at'] ?? null,
            'avatar'         => $account->avatar,
            'full_name'      => $account->full_name,
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
            // Update account with profile data only (no stats)
            $this->repository->createOrUpdate([
                'user_id'      => $userId,
                'integration'  => IntegrationEnum::GITHUB,
                'display_name' => $account->display_name,
                'full_name'    => $account->full_name,
                'avatar'       => $account->avatar,
                'data'         => [
                    'display_name'   => $displayName,
                    'connected_at'   => $account->data['connected_at'] ?? now()->toISOString(),
                    'last_synced_at' => now()->toISOString(),
                ],
            ]);
        } catch (\Exception $e) {
            // If API fails, still update profile data
            $this->repository->createOrUpdate([
                'user_id'      => $userId,
                'integration'  => IntegrationEnum::GITHUB,
                'display_name' => $account->display_name,
                'full_name'    => $account->full_name,
                'avatar'       => $account->avatar,
                'data'         => [
                    'display_name'   => $displayName,
                    'connected_at'   => $account->data['connected_at'] ?? now()->toISOString(),
                    'last_synced_at' => now()->toISOString(),
                    'error'          => 'Failed to sync: ' . $e->getMessage(),
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
            'connected_at'   => $account->data['connected_at'] ?? null,
            'last_synced_at' => $account->data['last_synced_at'] ?? null,
            'avatar'         => $account->avatar,
            'full_name'      => $account->full_name,
            'error'          => $account->data['error'] ?? null,
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
            // Get user profile using stored API token
            $profile = $this->wakapiService->setToken($account->data['api_token'])->getUser();

            // Update account with profile data only (no stats)
            $updatedData = array_merge($account->data, [
                'last_synced_at' => now()->toISOString(),
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
            'display_name'   => $account->data['username'] ?? $account->display_name,
            'full_name'      => $account->full_name,
            'api_token'      => $account->data['api_token'] ?? null,
            'connected_at'   => $account->data['connected_at'] ?? null,
            'last_synced_at' => $account->data['last_synced_at'] ?? null,
            'avatar'         => $account->avatar,
            'error'          => $account->data['error'] ?? null,
        ];
    }
}
