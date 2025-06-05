<?php

namespace App\Providers;

use App\Services\Integrations\GithubService;
use App\Services\Integrations\LeetcodeService;
use App\Services\Integrations\Services\Integrations\Contracts\GithubServiceInterface;
use App\Services\Integrations\Services\Integrations\Contracts\LeetcodeServiceInterface;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->app->bind(GithubServiceInterface::class, GithubService::class);
        $this->app->bind(LeetcodeServiceInterface::class, LeetcodeService::class);
    }
}
