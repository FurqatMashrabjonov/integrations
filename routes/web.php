<?php

use App\Http\Integrations\Leetcode\LeetcodeConnector;
use App\Http\Integrations\Leetcode\Requests\GetUserRecentSubmissions;
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


Route::get('/leetcode', function (\App\Services\Interfaces\LeetcodeServiceInterface $service, \Illuminate\Http\Request $request) {
//    dd($service->getUser($request->input('username')));
    dd($service->getUserRecentSubmissions($request->input('username')));
});


Route::get('github', function () {
    $connector = new App\Http\Integrations\Github\GithubConnector();
    return redirect($connector->getAuthorizationUrl());
});
