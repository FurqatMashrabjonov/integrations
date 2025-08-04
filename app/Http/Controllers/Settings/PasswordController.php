<?php

namespace App\Http\Controllers\Settings;

use Inertia\Inertia;
use Inertia\Response;
use App\Enums\IntegrationEnum;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rules\Password;
use App\Services\IntegrationAccountService;
use App\Services\Integrations\Services\Integrations\Contracts\FitbitServiceInterface;

class PasswordController extends Controller
{
    /**
     * Show the user's password settings page.
     */
    public function edit(): Response
    {
        return Inertia::render('settings/password');
    }

    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password'         => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back();
    }

    public function integrations(): Response
    {
        $user = Auth::user();
        
        // Get integration account service
        $integrationAccountService = app(IntegrationAccountService::class);
        
        // Build integration data similar to dashboard
        $integrationData = [
            'github' => [
                'isConnected' => $integrationAccountService->getByUserAndIntegration($user->id, IntegrationEnum::GITHUB) !== null,
                'profile'     => $integrationAccountService->getGithubProfile($user->id),
            ],
            'fitbit' => [
                'isConnected' => $integrationAccountService->getByUserAndIntegration($user->id, IntegrationEnum::FITBIT) !== null,
                'profile'     => $integrationAccountService->getFitbitProfile($user->id),
            ],
            'leetcode' => [
                'isConnected' => $integrationAccountService->getByUserAndIntegration($user->id, IntegrationEnum::LEETCODE) !== null,
                'profile'     => $integrationAccountService->getLeetcodeProfile($user->id),
            ],
            'wakapi' => [
                'isConnected' => $integrationAccountService->getByUserAndIntegration($user->id, IntegrationEnum::WAKAPI) !== null,
                'profile'     => $integrationAccountService->getWakapiProfile($user->id),
            ],
        ];

        return Inertia::render('settings/integrations', [
            'integrationData' => $integrationData,
        ]);
    }
}
