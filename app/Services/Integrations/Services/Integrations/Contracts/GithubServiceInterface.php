<?php

namespace App\Services\Integrations\Services\Integrations\Contracts;

use Illuminate\Http\Request;

interface GithubServiceInterface extends IntegrationInterface
{
    public function getRedirectUrl(): string;

    public function handleCallback(Request $request);
}
