<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Integrations\LeetcodeController;
use App\Http\Controllers\Api\Integrations\FitbitController;
use App\Http\Controllers\Api\Integrations\GithubController;

Route::prefix('fitbit')->as('fitbit.')->group(function () {
    Route::get('/redirect', [FitbitController::class, 'redirect'])->name('redirect');
    Route::get('/callback', [FitbitController::class, 'callback'])->name('callback');
});

Route::prefix('github')->as('github.')->group(function () {
    Route::get('/redirect', [GithubController::class, 'redirect'])->name('redirect');
    Route::get('/callback', [GithubController::class, 'callback'])->name('callback');
});

Route::prefix('leetcode')->as('leetcode.')->middleware(['auth', 'web'])->group(function () {
    Route::post('/store', [LeetcodeController::class, 'store'])->name('store');
    Route::get('/exists', [LeetcodeController::class, 'exists'])->name('exists');
    Route::delete('/destroy', [LeetcodeController::class, 'destroy'])->name('destroy');
    Route::get('/show', [LeetcodeController::class, 'show'])->name('show');
});
