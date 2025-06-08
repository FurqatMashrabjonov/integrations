<?php

namespace App\Http\Controllers\Api\Integrations;

use App\Http\Controllers\Controller;
use App\Services\Integrations\Services\Integrations\Contracts\FitbitServiceInterface;
use Illuminate\Http\Request;

class FitbitController extends Controller
{
    public function __construct(private readonly FitbitServiceInterface $service)
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
