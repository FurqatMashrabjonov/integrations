<?php

namespace App\Services;

use App\Dtos\BaseDto;
use App\Http\Integrations\Leetcode\Dtos\UserProfileData;
use App\Http\Integrations\Leetcode\LeetcodeConnector;
use App\Http\Integrations\Leetcode\Requests\GetUserProfile;
use App\Http\Integrations\Leetcode\Requests\GetUserRecentSubmissions;
use App\Services\Interfaces\LeetcodeServiceInterface;
use Saloon\Exceptions\Request\FatalRequestException;
use Saloon\Exceptions\Request\RequestException;
use Saloon\Http\Request;

class LeetcodeService implements LeetcodeServiceInterface
{

    public function __construct(private readonly LeetcodeConnector $connector)
    {
    }

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
            badges: (array)$user?->badges,
            ac_submission_num_easy: $ac_submissions->where('difficulty', 'Easy')->first()?->count ?? 0,
            ac_submission_num_medium: $ac_submissions->where('difficulty', 'Medium')->first()?->count ?? 0,
            ac_submission_num_hard: $ac_submissions->where('difficulty', 'Hard')->first()?->count ?? 0,
        );
    }

    public function getUserRecentSubmissions(string $username): array
    {
        $user = $this->send(new GetUserRecentSubmissions($username))?->data;

        throw_if(!$user, new \Exception('User not found'));

        return $user->recentSubmissionList;
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
