<?php

namespace App\Services\Integrations;

use App\Dtos\BaseDto;
use Saloon\Http\Request;
use Illuminate\Support\Collection;
use Saloon\Exceptions\Request\RequestException;
use Saloon\Exceptions\Request\FatalRequestException;
use App\Http\Integrations\Leetcode\LeetcodeConnector;
use App\Http\Integrations\Leetcode\Dtos\UserProfileData;
use App\Http\Integrations\Leetcode\Requests\GetUserProfile;
use App\Http\Integrations\Leetcode\Requests\GetUserRecentSubmissions;
use App\Services\Integrations\Services\Integrations\Contracts\LeetcodeServiceInterface;

class LeetcodeService implements LeetcodeServiceInterface
{
    public function __construct(private LeetcodeConnector $connector) {}

    /**
     * @throws FatalRequestException
     * @throws RequestException
     * @throws \JsonException
     * @throws \Exception
     * @throws \Throwable
     */
    public function getUser(string $username): BaseDto
    {
        $user = $this->send(new GetUserProfile($username))?->data?->matchedUser;

        throw_if(!$user, new \Exception('User not found'));

        $ac_submissions = collect($user->submitStatsGlobal?->acSubmissionNum);

        return new UserProfileData(
            username: $user->username,
            real_name: $user?->profile?->realName,
            user_avatar: $user?->profile?->userAvatar,
            ranking: $user?->profile?->ranking,
            badges: (array) $user?->badges,
            ac_submission_num_easy: $ac_submissions->where('difficulty', 'Easy')->first()->count ?? 0,
            ac_submission_num_medium: $ac_submissions->where('difficulty', 'Medium')->first()->count ?? 0,
            ac_submission_num_hard: $ac_submissions->where('difficulty', 'Hard')->first()->count ?? 0,
        );
    }

    public function getUserRecentSubmissions(string $username, ?string $date = null): Collection
    {
        $user = $this->send(new GetUserRecentSubmissions($username))?->data;

        throw_if(!$user, new \Exception('User not found'));

        return collect($user->recentAcSubmissionList ?? [])
            ->when($date, function ($query) use ($date) {
                return $query->filter(fn ($sub) => $sub->timestamp && date('Y-m-d', $sub->timestamp) === $date);
            })
            ->map(fn ($sub) => [
                'title'          => $sub->title,
                'title_slug'     => $sub->titleSlug,
                'status_display' => $sub->statusDisplay,
                'timestamp'      => $sub->timestamp ? date('Y-m-d H:i:s', $sub->timestamp) : null,
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
}
