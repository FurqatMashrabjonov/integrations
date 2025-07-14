<?php

namespace App\Http\Controllers\Api\Integrations;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Saloon\Exceptions\InvalidStateException;
use App\Services\Integrations\Services\Integrations\Contracts\GithubServiceInterface;

class GithubController extends Controller
{
    public function __construct(private readonly GithubServiceInterface $service) {}

    public function redirect()
    {
        return redirect()->away($this->service->getRedirectUrl());
    }

    /**
     * @throws InvalidStateException
     */
    public function callback(Request $request)
    {
        $this->service->handleCallback($request);

        return redirect()->route('integrations.edit');
    }
}
