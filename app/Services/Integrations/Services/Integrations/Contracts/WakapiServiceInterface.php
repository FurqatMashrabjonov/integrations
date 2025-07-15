<?php

namespace App\Services\Integrations\Services\Integrations\Contracts;

interface WakapiServiceInterface
{
    public function getUser();

    public function getDailyActivities(string $range = 'today');
}
