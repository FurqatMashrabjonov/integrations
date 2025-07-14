<?php

namespace App\Http\Integrations\Wakapi;

use Saloon\Http\Connector;
use Saloon\Traits\Plugins\AcceptsJson;

class WakapiConnector extends Connector
{
    use AcceptsJson;

    /**
     * The Base URL of the API.
     */
    public function resolveBaseUrl(): string
    {
        return 'https://wakapi.dev/api';
    }

    /**
     * The headers for the request
     */
    protected function defaultHeaders(): array
    {
        return [
            'Content-Type' => 'application/json',
            'Accept'       => 'application/json',
        ];
    }
}
