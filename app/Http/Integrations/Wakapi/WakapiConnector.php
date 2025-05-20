<?php

namespace App\Http\Integrations\Wakapi;

use Saloon\Http\Connector;
use Saloon\Traits\Plugins\AcceptsJson;

class WakapiConnector extends Connector
{
    use AcceptsJson;


    public function __construct(
        private readonly string $token
    )
    {
    }

    /**
     * The Base URL of the API
     */
    public function resolveBaseUrl(): string
    {
        return 'https://wakapi.dev/api/';
    }

    /**
     *
     * Default headers for every request
     */
    protected function defaultHeaders(): array
    {
        return [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode($this->token)
        ];
    }

    /**
     * Default HTTP client options
     */
    protected function defaultConfig(): array
    {
        return [
            'proxy' => 'http://192.168.7.251:3128'
        ];
    }
}
