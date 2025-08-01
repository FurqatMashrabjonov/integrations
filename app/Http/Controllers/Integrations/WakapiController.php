<?php

namespace App\Http\Controllers\Integrations;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Enums\IntegrationEnum;
use App\Http\Requests\Integrations\WakapiStoreRequest;
use App\Services\IntegrationAccountService;
use App\Services\Integrations\WakapiService;

class WakapiController extends Controller
{
    public function __construct(
        public readonly IntegrationAccountService $integrationService,
        public readonly WakapiService $wakapiService
    ) {}

    // Store or update the user's Wakapi API token
    public function store(WakapiStoreRequest $request)
    {
        $user = Auth::user();
        
        // First, validate that the API token works by fetching user profile
        try {
            $profile = $this->wakapiService->setToken($request->api_token)->getUser();
        } catch (\Exception $e) {
            // API token is invalid or API is unreachable
            return back()->withErrors([
                'api_token' => 'Wakapi API token yaroqsiz yoki server bilan bog\'lanishda xatolik. Iltimos, to\'g\'ri API token kiriting.'
            ]);
        }

        // If token is valid, create/update the account
        $account = $this->integrationService->createOrUpdateAccount(
            $user->id,
            IntegrationEnum::WAKAPI,
            $profile->username,
            $profile->display_name,
            $profile->photo,
            [
                'username' => $profile->username,
                'email' => $profile->email,
                'api_token' => $request->api_token
            ]
        );

        // Now sync the profile data (we already have it from validation)
        try {
            $this->integrationService->syncWakapiProfile($user->id);
        } catch (\Exception $e) {
            // If sync fails, still return success but log the error
            \Log::error('Wakapi profile sync failed: ' . $e->getMessage());
        }

        // For Inertia requests, return back with flash message
        return back()->with('success', 'Wakapi akkaunt muvaffaqiyatli ulandi!');
    }

    // Check if the user has a Wakapi account connected
    public function exists()
    {
        $user = Auth::user();
        $account = $this->integrationService->getByUserAndIntegration($user->id, IntegrationEnum::WAKAPI);

        return response()->json(['exists' => $account !== null]);
    }

    // Remove the user's Wakapi account
    public function destroy()
    {
        $user = Auth::user();
        
        $this->integrationService->removeIntegration($user->id, IntegrationEnum::WAKAPI);

        // For Inertia requests, return back with flash message
        return back()->with('success', 'Wakapi akkaunt muvaffaqiyatli uzildi!');
    }

    // Show the user's Wakapi profile and recent activity
    public function show()
    {
        $user = Auth::user();
        $profileData = $this->integrationService->getWakapiProfile($user->id);

        if (!$profileData) {
            return response()->json(['error' => 'Wakapi profile not yet synced'], 404);
        }

        // Always return JSON for AJAX/fetch requests
        if (request()->expectsJson() || request()->isJson() || request()->header('Accept') === 'application/json') {
            return response()->json($profileData);
        }

        // Otherwise, render Inertia page
        return Inertia::render('Integrations/Wakapi', $profileData);
    }
}
