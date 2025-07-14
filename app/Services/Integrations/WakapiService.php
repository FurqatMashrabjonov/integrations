<?php

namespace App\Services\Integrations;

use App\Http\Integrations\Wakapi\WakapiConnector;
use App\Http\Integrations\Wakapi\Requests\GetUserProfile;
use App\Http\Integrations\Wakapi\Requests\GetDailyActivities;

class WakapiService
{
    //    protected WakapiConnector $connector;
    //
    //    public function __construct()
    //    {
    //        $this->connector = new WakapiConnector(config('')); // Add your Wakapi API key or other configuration here;
    //    }
    //
    //    public function getUserProfile(string $username): array
    //    {
    //        $request  = new GetUserProfile($username);
    //        $response = $this->connector->send($request);
    //
    //        return $response->json();
    //    }
    //
    //    public function getDailyActivities(string $username, string $range = 'today'): array
    //    {
    //        $request  = new GetDailyActivities($username, $range);
    //        $response = $this->connector->send($request);
    //
    //        return $response->json();
    //    }
}
