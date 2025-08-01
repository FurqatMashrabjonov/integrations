<?php

namespace App\Http\Controllers\Api\Integrations;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Enums\IntegrationEnum;
use App\Services\IntegrationAccountService;
use App\Services\Integrations\FitbitService;
use Inertia\Inertia;

class FitbitController extends Controller
{
    public function __construct(
        private readonly IntegrationAccountService $integrationAccountService,
        private readonly FitbitService $fitbitService
    ) {}

    public function exists(Request $request)
    {
        $account = $this->integrationAccountService->getByUserAndIntegration(
            $request->user()->id,
            IntegrationEnum::FITBIT
        );

        return response()->json([
            'exists' => $account !== null
        ]);
    }

    public function show(Request $request)
    {
        $profile = $this->integrationAccountService->getFitbitProfile($request->user()->id);

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        return response()->json($profile);
    }

    public function redirect()
    {
        return redirect()->away($this->fitbitService->getRedirectUrl());
    }

    public function callback(Request $request)
    {
        try {
            $this->fitbitService->handleCallback($request);
            
            // Sync profile data after successful connection
            $this->integrationAccountService->syncFitbitProfile($request->user()->id);
            
            return Inertia::location(route('integrations.edit'));
        } catch (\Exception $e) {
            return Inertia::location(route('integrations.edit', ['error' => 'Failed to connect Fitbit account']));
        }
    }

    public function destroy(Request $request)
    {
        $removed = $this->integrationAccountService->removeIntegration(
            $request->user()->id,
            IntegrationEnum::FITBIT
        );

        if ($removed) {
            return response()->json(['message' => 'Fitbit account disconnected successfully']);
        }

        return response()->json(['message' => 'Failed to disconnect Fitbit account'], 500);
    }
}
