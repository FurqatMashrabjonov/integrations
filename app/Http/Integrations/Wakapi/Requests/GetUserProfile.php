<?php

namespace App\Http\Integrations\Wakapi\Requests;

use Saloon\Enums\Method;
use Saloon\Http\Request;

class GetUserProfile extends Request
{
    public function __construct(protected readonly string $username = 'current') {}

    /**
     * The HTTP method of the request
     */
    protected Method $method = Method::GET;

    /**
     * The endpoint for the request
     */
    public function resolveEndpoint(): string
    {
        return '/compat/wakatime/v1/users/' . $this->username;
    }
}
