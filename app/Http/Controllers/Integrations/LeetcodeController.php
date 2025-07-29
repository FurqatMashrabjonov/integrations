<?php

namespace App\Http\Controllers\Integrations;

use Inertia\Inertia;
use App\Models\LeetcodeProfile;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Integrations\LeetcodeStoreRequest;
use App\Services\Integrations\Services\Integrations\Contracts\LeetcodeServiceInterface;

class LeetcodeController extends Controller
{
    public function __construct(public readonly LeetcodeServiceInterface $service) {}

    // Store or update the user's Leetcode username
    public function store(LeetcodeStoreRequest $request)
    {
        $user     = Auth::user();
        $leetcode = $this->service->store($user->id, $request->username);
        // Trigger initial sync after storing username
        $this->service->syncProfile($user->id);

        return response()->json(['success' => true, 'leetcode' => $leetcode]);
    }

    // Check if the user has a Leetcode account connected
    public function exists()
    {
        $user   = Auth::user();
        $exists = $this->service->exists($user->id);

        return response()->json(['exists' => $exists]);
    }

    // Remove the user's Leetcode account
    public function destroy()
    {
        $user = Auth::user();
        $this->service->destroy($user->id);

        return response()->json(['success' => true]);
    }

    // Show the user's Leetcode profile and recent activity
    public function show()
    {
        $user     = Auth::user();
        $leetcode = $this->service->getAccount($user->id);
        if (!$leetcode) {
            return response()->json(['error' => 'Leetcode account not connected'], 404);
        }

        $profileModel = LeetcodeProfile::where('leetcode_id', $leetcode->id)->first();
        if (!$profileModel) {
            return response()->json(['error' => 'Leetcode profile not yet synced'], 404);
        }

        // Always return JSON for AJAX/fetch requests
        if (request()->expectsJson() || request()->isJson() || request()->header('Accept') === 'application/json') {
            return response()->json([
                'profile'        => $profileModel->profile,
                'recent'         => $profileModel->recent,
                'last_synced_at' => $profileModel->last_synced_at,
            ]);
        }

        // Otherwise, render Inertia page
        return Inertia::render('Integrations/Leetcode', [
            'profile'        => $profileModel->profile,
            'recent'         => $profileModel->recent,
            'last_synced_at' => $profileModel->last_synced_at,
        ]);
    }
}
