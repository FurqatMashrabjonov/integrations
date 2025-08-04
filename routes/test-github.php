<?php

use Illuminate\Support\Facades\Route;

Route::get('/test-github-integration', function () {
    try {
        // Test service instantiation
        $githubService      = app(App\Services\Integrations\GithubService::class);
        $integrationService = app(App\Services\IntegrationAccountService::class);

        // Test redirect URL generation
        $redirectUrl = $githubService->getRedirectUrl();

        return response()->json([
            'status'       => 'success',
            'message'      => 'GitHub integration is properly configured',
            'redirect_url' => $redirectUrl,
            'tests_passed' => [
                'github_service_instantiated'      => true,
                'integration_service_instantiated' => true,
                'redirect_url_generated'           => !empty($redirectUrl),
            ],
        ]);
    } catch (Exception $e) {
        return response()->json([
            'status'  => 'error',
            'message' => 'GitHub integration test failed: ' . $e->getMessage(),
            'trace'   => $e->getTraceAsString(),
        ], 500);
    }
});
