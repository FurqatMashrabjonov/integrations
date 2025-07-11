<?php

use App\Events\TestEvent;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [DashboardController::class, 'home'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

Route::middleware(['auth'])
    ->prefix('integrations')->as('integrations.')->group(function () {
    require __DIR__.'/integrations.php';
});

Route::get('reverb', function (){
    TestEvent::dispatch();
});
