<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class OnboardingController extends Controller
{
    /**
     * Show the standard onboarding flow
     */
    public function index(): Response
    {
        return Inertia::render('onboarding');
    }

    /**
     * Show the mobile-optimized onboarding flow
     */
    public function mobile(): Response
    {
        return Inertia::render('onboarding-mobile');
    }

    /**
     * Show the feature-rich onboarding flow
     */
    public function features(): Response
    {
        return Inertia::render('onboarding-features');
    }

    /**
     * Show the onboarding demo page with all variants
     */
    public function demo(): Response
    {
        return Inertia::render('onboarding-demo');
    }

    /**
     * Complete onboarding and redirect to dashboard
     */
    public function complete(Request $request)
    {
        // Here you could save user preferences, mark onboarding as complete, etc.
        // For now, we'll just redirect to the dashboard

        return redirect()->route('dashboard')->with('message', 'Welcome! Your integration hub is ready to use.');
    }
}
