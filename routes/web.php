<?php

use App\Events\TestEvent;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

Route::get('/', [DashboardController::class, 'home'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

Route::middleware(['auth'])
    ->prefix('integrations')->as('integrations.')->group(function () {
        require __DIR__ . '/integrations.php';
    });

Route::get('reverb', function () {
    TestEvent::dispatch();
});

Route::get('telegram', function (Illuminate\Http\Request $request) {
    dd($request->all());
})->name('telegram');
