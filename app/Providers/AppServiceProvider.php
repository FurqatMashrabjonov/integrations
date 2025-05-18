<?php

namespace App\Providers;

use App\Services\GithubService;
use App\Services\Interfaces\GithubServiceInterface;
use App\Services\Interfaces\LeetcodeServiceInterface;
use App\Services\LeetcodeService;
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
