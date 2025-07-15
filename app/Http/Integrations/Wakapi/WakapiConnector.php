<?php

namespace App\Http\Integrations\Wakapi;

use Saloon\Http\Connector;
use Saloon\Traits\Plugins\AcceptsJson;

class WakapiConnector extends Connector
{
    use AcceptsJson;

    protected string $token = '';

    public function setToken(string $token): self
    {
        $this->token = $token;

        return $this;
    }

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
            'Content-Type'  => 'application/json',
            'Accept'        => 'application/json',
            'Authorization' => 'Bearer ' . base64_encode($this->token),
        ];
    }
}
