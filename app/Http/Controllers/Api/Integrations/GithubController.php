<?php

namespace App\Http\Controllers\Api\Integrations;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Enums\IntegrationEnum;
use App\Http\Controllers\Controller;
use App\Services\IntegrationAccountService;
use App\Services\Integrations\GithubService;

class GithubController extends Controller
{
    public function __construct(
        private readonly IntegrationAccountService $integrationAccountService,
        private readonly GithubService $githubService
    ) {}

    public function exists(Request $request)
    {
        $account = $this->integrationAccountService->getByUserAndIntegration(
            $request->user()->id,
            IntegrationEnum::GITHUB
        );

        return response()->json([
            'exists' => $account !== null,
        ]);
    }

    public function show(Request $request)
    {
        $profile = $this->integrationAccountService->getGithubProfile($request->user()->id);

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        return response()->json($profile);
    }

    public function redirect()
    {
        return redirect()->away($this->githubService->getRedirectUrl());
    }

    public function callback(Request $request)
    {
        try {
            $this->githubService->handleCallback($request);

            // Sync profile data after successful connection
            $this->integrationAccountService->syncGithubProfile($request->user()->id);

            return Inertia::location(route('integrations.edit'));
        } catch (\Exception $e) {
            return Inertia::location(route('integrations.edit', ['error' => 'Failed to connect GitHub account']));
        }
    }

    public function destroy(Request $request)
    {
        $removed = $this->integrationAccountService->removeIntegration(
            $request->user()->id,
            IntegrationEnum::GITHUB
        );

        if ($removed) {
            return back()->with('success', 'GitHub akkaunt muvaffaqiyatli uzildi!');
        }

        return back()->with('error', 'GitHub akkuantni uzishda xatolik yuz berdi');
    }
}
