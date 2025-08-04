<?php

use App\Events\TestEvent;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\DashboardController;

Route::get('/', [DashboardController::class, 'home'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('calendar', [CalendarController::class, 'index'])->name('calendar');
    Route::get('rating', [RatingController::class, 'index'])->name('rating');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/pomodoro.php';

Route::middleware(['auth'])
    ->prefix('integrations')->as('integrations.')->group(function () {
        require __DIR__ . '/integrations.php';
    });

Route::get('reverb', function () {
    TestEvent::dispatch();
});

Route::get('csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

Route::get('telegram', function (Illuminate\Http\Request $request) {
    dd($request->all());
})->name('telegram');

