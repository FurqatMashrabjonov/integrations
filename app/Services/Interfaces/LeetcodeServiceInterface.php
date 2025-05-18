<?php

namespace App\Services\Interfaces;

interface LeetcodeServiceInterface extends IntegrationInterface
{
    public function getUserRecentSubmissions(string $username): array;
}
