<?php

namespace App\Services\Integrations\Services\Integrations\Contracts;

interface WakapiServiceInterface
{
    public function getUserProfile(string $username): array;

    public function getDailyActivities(string $username, string $range = 'today'): array;
}
