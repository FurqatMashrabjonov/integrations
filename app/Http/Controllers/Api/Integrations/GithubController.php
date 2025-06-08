<?php

namespace App\Http\Controllers\Api\Integrations;

use App\Http\Controllers\Controller;
use App\Services\Integrations\Services\Integrations\Contracts\FitbitServiceInterface;
use App\Services\Integrations\Services\Integrations\Contracts\GithubServiceInterface;
use Illuminate\Http\Request;

class GithubController extends Controller
{
    public function __construct(private readonly GithubServiceInterface $service)
    {
    }

    public function redirect()
    {
        return redirect()->away($this->service->getRedirectUrl());
    }

    public function callback(Request $request)
    {
        $this->service->handleCallback($request);

        return redirect()->route('integrations.edit');
    }
}
