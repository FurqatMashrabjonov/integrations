<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Integrations\WakapiController;
use App\Http\Controllers\Integrations\LeetcodeController;
use App\Http\Controllers\Api\Integrations\FitbitController;
use App\Http\Controllers\Api\Integrations\GithubController;

Route::prefix('fitbit')->as('fitbit.')->group(function () {
    Route::get('/redirect', [FitbitController::class, 'redirect'])->name('redirect');
    Route::get('/callback', [FitbitController::class, 'callback'])->name('callback');
    Route::middleware(['auth', 'web'])->group(function () {
        Route::get('/exists', [FitbitController::class, 'exists'])->name('exists');
        Route::get('/show', [FitbitController::class, 'show'])->name('show');
        Route::delete('/destroy', [FitbitController::class, 'destroy'])->name('destroy');
    });
});

Route::prefix('github')->as('github.')->group(function () {
    Route::get('/redirect', [GithubController::class, 'redirect'])->name('redirect');
    Route::get('/callback', [GithubController::class, 'callback'])->name('callback');
    Route::middleware(['auth', 'web'])->group(function () {
        Route::get('/exists', [GithubController::class, 'exists'])->name('exists');
        Route::get('/show', [GithubController::class, 'show'])->name('show');
        Route::delete('/destroy', [GithubController::class, 'destroy'])->name('destroy');
    });
});

Route::prefix('leetcode')->as('leetcode.')->middleware(['auth', 'web'])->group(function () {
    Route::post('/store', [LeetcodeController::class, 'store'])->name('store');
    Route::get('/exists', [LeetcodeController::class, 'exists'])->name('exists');
    Route::delete('/destroy', [LeetcodeController::class, 'destroy'])->name('destroy');
    Route::get('/show', [LeetcodeController::class, 'show'])->name('show');
});

Route::prefix('wakapi')->as('wakapi.')->middleware(['auth', 'web'])->group(function () {
    Route::post('/store', [WakapiController::class, 'store'])->name('store');
    Route::get('/exists', [WakapiController::class, 'exists'])->name('exists');
    Route::delete('/destroy', [WakapiController::class, 'destroy'])->name('destroy');
    Route::get('/show', [WakapiController::class, 'show'])->name('show');
});
