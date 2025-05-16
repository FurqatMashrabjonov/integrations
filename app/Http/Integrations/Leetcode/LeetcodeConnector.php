<?php

namespace App\Http\Integrations\Leetcode;

use Saloon\Http\Connector;
use Saloon\Traits\Plugins\AcceptsJson;

class LeetcodeConnector extends Connector
{
    use AcceptsJson;

    /**
     * The Base URL of the API
     */
    public function resolveBaseUrl(): string
    {
        return 'https://leetcode.com/graphql';
    }

    /**
     * Default headers for every request
     */
    protected function defaultHeaders(): array
    {
        return [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'Referer' => 'https://leetcode.com',
        ];
    }

    /**
     * Default HTTP client options
     */
    protected function defaultConfig(): array
    {
        return [];
    }
}
