<?php

use App\Events\TestEvent;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'steps' => auth()->user()->steps()->where('date', now()->format('Y-m-d'))->first(),
        ]);
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

Route::prefix('integrations')->as('integrations.')->group(function () {
    require __DIR__.'/integrations.php';
});

Route::get('reverb', function (){
    TestEvent::dispatch();
});
