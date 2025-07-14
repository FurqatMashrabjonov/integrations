<?php

namespace App\Services\Integrations\Services\Integrations\Contracts;

use App\Http\Integrations\Leetcode\Dtos\UserProfileData;
use Illuminate\Support\Collection;

interface LeetcodeServiceInterface extends IntegrationInterface
{
    public function getUserRecentSubmissions(string $username, ?string $date = null): Collection;

    public function getUser(string $username): UserProfileData;
}
