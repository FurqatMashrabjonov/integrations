<?php

namespace App\Http\Integrations\Fitbit\Requests;

use Saloon\Enums\Method;
use Saloon\Http\Request;

class GetUserActivitiesRequest extends Request
{
    public function __construct(public string $date) {}

    /**
     * The HTTP method of the request
     */
    protected Method $method = Method::GET;

    /**
     * The endpoint for the request
     */
    public function resolveEndpoint(): string
    {
        return '/1/user/-/activities/date/' . $this->date . '.json';
    }
}
