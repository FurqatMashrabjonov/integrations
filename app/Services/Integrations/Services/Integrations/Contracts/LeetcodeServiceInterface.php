<?php

namespace App\Services\Integrations\Services\Integrations\Contracts;

use Illuminate\Support\Collection;
use App\Http\Integrations\Leetcode\Dtos\UserProfileData;

interface LeetcodeServiceInterface extends IntegrationInterface
{
    public function getUserRecentSubmissions(string $username, ?string $date = null): Collection;

    public function getUser(string $username): UserProfileData;

    public function syncProfile(int $userId): void;
}
