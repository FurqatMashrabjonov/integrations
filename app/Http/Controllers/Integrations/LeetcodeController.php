<?php

namespace App\Http\Controllers\Integrations;

use Inertia\Inertia;
use App\Enums\IntegrationEnum;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Services\IntegrationAccountService;
use App\Services\Integrations\LeetcodeService;
use App\Http\Requests\Integrations\LeetcodeStoreRequest;

class LeetcodeController extends Controller
{
    public function __construct(
        public readonly IntegrationAccountService $integrationService,
        public readonly LeetcodeService $leetcodeService
    ) {}

    // Store or update the user's Leetcode username
    public function store(LeetcodeStoreRequest $request)
    {
        $user = Auth::user();

        // First, validate that the username exists on LeetCode
        try {
            $profile = $this->leetcodeService->getUser($request->username);
        } catch (\Exception $e) {
            // Username doesn't exist on LeetCode
            return back()->withErrors([
                'username' => 'LeetCode da "' . $request->username . '" foydalanuvchi topilmadi. Iltimos, to\'g\'ri username kiriting.',
            ]);
        }

        // If username exists, create/update the account
        $account = $this->integrationService->createOrUpdateAccount(
            $user->id,
            IntegrationEnum::LEETCODE,
            $request->username,
            $profile->real_name,
            $profile->user_avatar,
            ['username' => $request->username]
        );

        // Now sync the profile data (we already have it from validation)
        try {
            $this->integrationService->syncLeetcodeProfile($user->id);
        } catch (\Exception $e) {
            // If sync fails, still return success but log the error
            \Log::error('LeetCode profile sync failed: ' . $e->getMessage());
        }

        // For Inertia requests, return back with flash message
        return back()->with('success', 'LeetCode akkaunt muvaffaqiyatli ulandi!');
    }

    // Check if the user has a Leetcode account connected
    public function exists()
    {
        $user    = Auth::user();
        $account = $this->integrationService->getByUserAndIntegration($user->id, IntegrationEnum::LEETCODE);

        return response()->json(['exists' => $account !== null]);
    }

    // Remove the user's Leetcode account
    public function destroy()
    {
        $user = Auth::user();

        $this->integrationService->removeIntegration($user->id, IntegrationEnum::LEETCODE);

        // For Inertia requests, return back with flash message
        return back()->with('success', 'LeetCode akkaunt muvaffaqiyatli uzildi!');
    }

    // Show the user's Leetcode profile and recent activity
    public function show()
    {
        $user        = Auth::user();
        $profileData = $this->integrationService->getLeetcodeProfile($user->id);

        if (!$profileData) {
            return response()->json(['error' => 'Leetcode profile not yet synced'], 404);
        }

        // Always return JSON for AJAX/fetch requests
        if (request()->expectsJson() || request()->isJson() || request()->header('Accept') === 'application/json') {
            return response()->json($profileData);
        }

        // Otherwise, render Inertia page
        return Inertia::render('Integrations/Leetcode', $profileData);
    }
}
