<?php

require_once 'vendor/autoload.php';

use App\Services\IntegrationAccountService;
use App\Services\GithubService;

// Test the GitHub integration service
echo "Testing GitHub Integration...\n";

try {
    // Create service instance
    $githubService = new GithubService();
    $integrationService = new IntegrationAccountService($githubService);
    
    // Test sync method
    echo "Testing syncGithubProfile method...\n";
    $result = $integrationService->syncGithubProfile(1); // Using user ID 1
    
    if ($result) {
        echo "✅ syncGithubProfile: SUCCESS\n";
        print_r($result);
    } else {
        echo "❌ syncGithubProfile: FAILED\n";
    }
    
    // Test get method
    echo "\nTesting getGithubProfile method...\n";
    $profile = $integrationService->getGithubProfile(1);
    
    if ($profile) {
        echo "✅ getGithubProfile: SUCCESS\n";
        print_r($profile);
    } else {
        echo "❌ getGithubProfile: FAILED\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
