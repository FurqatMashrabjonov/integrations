<?php

namespace App\Services\Integrations;

use Saloon\Http\Request;
use Illuminate\Support\Collection;
use Saloon\Exceptions\Request\RequestException;
use Saloon\Exceptions\Request\FatalRequestException;
use App\Http\Integrations\Leetcode\LeetcodeConnector;
use App\Http\Integrations\Leetcode\Dtos\UserProfileData;
use App\Http\Integrations\Leetcode\Requests\GetUserProfile;
use App\Repositories\Contracts\LeetcodeRepositoryInterface;
use App\Http\Integrations\Leetcode\Requests\GetUserRecentSubmissions;
use App\Services\Integrations\Services\Integrations\Contracts\LeetcodeServiceInterface;

class LeetcodeService implements LeetcodeServiceInterface
{
    public function __construct(
        private LeetcodeConnector $connector,
        private LeetcodeRepositoryInterface $repository
    ) {}

    /**
     * @throws FatalRequestException
     * @throws RequestException
     * @throws \JsonException
     * @throws \Exception
     * @throws \Throwable
     */
    public function getUser(string $username): UserProfileData
    {
        $user = $this->send(new GetUserProfile($username))?->data?->matchedUser;

        throw_if(!$user, new \Exception('Leetcode servisida "' . $username . '" foydalanuvchi topilmadi'));

        $ac_submissions = collect($user->submitStatsGlobal?->acSubmissionNum);

        return new UserProfileData(
            username: $user->username,
            real_name: $user->profile->realName,
            user_avatar: $user->profile->userAvatar,
            ranking: $user->profile->ranking,
            badges: (array) $user->badges,
            ac_submission_num_easy: $ac_submissions->where('difficulty', 'Easy')->first()->count ?? 0,
            ac_submission_num_medium: $ac_submissions->where('difficulty', 'Medium')->first()->count ?? 0,
            ac_submission_num_hard: $ac_submissions->where('difficulty', 'Hard')->first()->count ?? 0,
        );
    }

    /**
     * @throws \Throwable
     * @throws FatalRequestException
     * @throws RequestException
     * @throws \JsonException
     */
    public function getUserRecentSubmissions(string $username, ?string $date = null): Collection
    {
        $user = $this->send(new GetUserRecentSubmissions($username))?->data;
        throw_if(!$user?->matchedUser?->username, new \Exception('Leetcode servisida "' . $username . '" foydalanuvchi topilmadi'));

        return collect($user->recentAcSubmissionList ?? [])
            ->when($date, function ($query) use ($date) {
                return $query->filter(fn ($sub) => $sub->timestamp && date('Y-m-d', $sub->timestamp) === $date);
            })
            ->map(fn ($sub) => [
                'title'          => $sub->title,
                'title_slug'     => $sub->titleSlug,
                'status_display' => $sub->statusDisplay,
                'date'           => $sub->timestamp ? date('Y-m-d H:i:s', $sub->timestamp) : null,
            ]);
    }

    /**
     * @throws FatalRequestException
     * @throws RequestException
     * @throws \JsonException
     */
    private function send(Request $request)
    {
        $response = $this->connector->send($request);

        if ($response->successful()) {
            return $response->object();
        }

        throw new \Exception('Failed to fetch data from Leetcode API');
    }

    public function store(int $userId, string $username)
    {
        return $this->repository->updateOrCreateByUserId($userId, $username);
    }

    public function exists(int $userId): bool
    {
        return $this->repository->existsByUserId($userId);
    }

    public function destroy(int $userId): void
    {
        $this->repository->deleteByUserId($userId);
    }

    public function getAccount(int $userId)
    {
        return $this->repository->findByUserId($userId);
    }

    public function syncProfile(int $userId): void
    {
        $leetcode = $this->repository->findByUserId($userId);
        if (!$leetcode) {
            throw new \Exception('Leetcode account not found for user');
        }
        $username = $leetcode->username;
        // Fetch profile and recent submissions
        $profile = $this->getUser($username);
        $recent  = $this->getUserRecentSubmissions($username)->toArray();
        // Store or update LeetcodeProfile
        \App\Models\LeetcodeProfile::updateOrCreate(
            [
                'leetcode_id' => $leetcode->id,
            ],
            [
                'username'       => $username,
                'profile'        => $profile,
                'recent'         => $recent,
                'last_synced_at' => now(),
            ]
        );
    }
}
