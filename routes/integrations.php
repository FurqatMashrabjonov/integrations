<?php

use App\Http\Controllers\Api\Integrations\FitbitController;
use App\Http\Controllers\Api\Integrations\GithubController;
use Illuminate\Support\Facades\Route;

Route::prefix('fitbit')->as('fitbit.')->group(function() {
    Route::get('/redirect', [FitbitController::class, 'redirect'])->name('redirect');
    Route::get('/callback', [FitbitController::class, 'callback'])->name('callback');
});


Route::prefix('github')->as('github.')->group(function() {
    Route::get('/redirect', [GithubController::class, 'redirect'])->name('redirect');
    Route::get('/callback', [GithubController::class, 'callback'])->name('callback');
});
