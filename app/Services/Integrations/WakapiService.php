<?php

namespace App\Services\Integrations;

use Saloon\Http\Request;
use Saloon\Exceptions\Request\RequestException;
use App\Http\Integrations\Wakapi\WakapiConnector;
use Saloon\Exceptions\Request\FatalRequestException;
use App\Http\Integrations\Wakapi\Dtos\UserActivities;
use App\Http\Integrations\Wakapi\Dtos\UserProfileData;
use App\Http\Integrations\Wakapi\Requests\GetUserProfile;
use App\Http\Integrations\Wakapi\Requests\GetDailyActivities;
use App\Services\Integrations\Services\Integrations\Contracts\WakapiServiceInterface;

class WakapiService implements WakapiServiceInterface
{
    public function __construct(protected WakapiConnector $connector) {}

    public function setToken(string $token): self
    {
        $this->connector->setToken($token);

        return $this;
    }

    /**
     * @throws FatalRequestException
     * @throws RequestException
     * @throws \Throwable
     */
    public function getUser()
    {
        $response = $this->send(new GetUserProfile);
        $user     = $response->object()->data;

        return new UserProfileData(
            username: $user->username,
            email: $user->email,
            photo: $user->photo,
            display_name: $user->display_name,
        );
    }

    /**
     * @throws \Throwable
     * @throws FatalRequestException
     * @throws RequestException
     * @throws \JsonException
     */
    public function getDailyActivities(string $range = 'today')
    {
        $response = $this->send(new GetDailyActivities($range));
        $data     = $response->object()->data;

        return new UserActivities(
            username: $data->username,
            started_at: $data->started_at,
            ended_at: $data->ended_at,
            total_seconds: $data->total_seconds,
            editors: $data->editors
        );
    }

    /**
     * @throws FatalRequestException
     * @throws \Throwable
     * @throws RequestException
     */
    private function send(Request $request)
    {
        $response = $this->connector->send($request);

        throw_if($response->clientError(), new \Exception($response->body()));

        return $response;
    }
}
