<?php

namespace App\Providers;

use App\Repositories\Contracts\FitbitAccountRepositoryInterface;
use App\Repositories\Contracts\IntegrationTokenRepositoryInterface;
use App\Repositories\Contracts\UserFitbitStepRepositoryInterface;
use App\Repositories\FitbitAccountRepository;
use App\Repositories\IntegrationTokenRepository;
use App\Repositories\UserFitbitStepRepository;
use App\Services\Integrations\FitbitService;
use App\Services\Integrations\GithubService;
use App\Services\Integrations\LeetcodeService;
use App\Services\Integrations\Services\Integrations\Contracts\FitbitServiceInterface;
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
        $this->app->bind(FitbitServiceInterface::class, FitbitService::class);
        $this->app->bind(IntegrationTokenRepositoryInterface::class, IntegrationTokenRepository::class);
        $this->app->bind(FitbitAccountRepositoryInterface::class, FitbitAccountRepository::class);
        $this->app->bind(UserFitbitStepRepositoryInterface::class, UserFitbitStepRepository::class);
    }
}
