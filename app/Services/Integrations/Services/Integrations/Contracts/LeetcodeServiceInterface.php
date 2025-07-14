<?php

namespace App\Services\Integrations\Services\Integrations\Contracts;

use Illuminate\Support\Collection;

interface LeetcodeServiceInterface extends IntegrationInterface
{
    public function getUserRecentSubmissions(string $username, ?string $date = null): Collection;
}
