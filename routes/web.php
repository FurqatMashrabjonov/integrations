<?php

use App\Http\Integrations\Leetcode\LeetcodeConnector;
use App\Http\Integrations\Leetcode\Requests\GetUserProfile;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';


Route::get('/leetcode', function () {
    $connector = new LeetcodeConnector();
    $response = $connector->send(new \App\Http\Integrations\Leetcode\Requests\GetUserProfile('furqatmashrabjonov'));

    return $response->json();
});
