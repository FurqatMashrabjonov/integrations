<?php

namespace App\Services\Integrations\Services\Integrations\Contracts;

interface LeetcodeServiceInterface extends IntegrationInterface
{
    public function getUserRecentSubmissions(string $username): array;
}
