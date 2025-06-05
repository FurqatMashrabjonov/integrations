<?php

namespace App\Http\Integrations\Fitbit\Requests;

use Saloon\Enums\Method;
use Saloon\Http\Request;

class GetUserStepsRequest extends Request
{
    /**
     * The HTTP method of the request
     */
    protected Method $method = Method::POST;

    /**
     * The endpoint for the request
     */
    public function resolveEndpoint(): string
    {
        return '/example';
    }
}
