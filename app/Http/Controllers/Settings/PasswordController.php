<?php

namespace App\Http\Controllers\Settings;

use App\Enums\IntegrationEnum;
use App\Http\Controllers\Controller;
use App\Http\Integrations\Fitbit\FitbitConnector;
use App\Models\IntegrationToken;
use App\Services\Integrations\Services\Integrations\Contracts\FitbitServiceInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Saloon\Http\Auth\AccessTokenAuthenticator;

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
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back();
    }

    public function integrations(): Response
    {
//        $steps = app(FitbitServiceInterface::class)->getUserSteps(auth()->id());
//        dd($steps);
        return Inertia::render('settings/integrations', [

        ]);
    }
}
