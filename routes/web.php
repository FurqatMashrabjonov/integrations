<?php

use App\Events\TestEvent;
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


Route::get('/leetcode', function (\App\Services\Integrations\Services\Integrations\Contracts\LeetcodeServiceInterface $service, \Illuminate\Http\Request $request) {
//    dd($service->getUser($request->input('username')));
    dd($service->getUserRecentSubmissions($request->input('username')));
});


Route::get('github', function () {
    $connector = new App\Http\Integrations\Github\GithubConnector();
    return redirect($connector->getAuthorizationUrl());
});

Route::get('wakapi', function () {
    $connector = new \App\Http\Integrations\Wakapi\WakapiConnector('cab6f60f-3a1b-4092-b9e5-e8d8ee4a5dc1');
    $user = $connector->send(new \App\Http\Integrations\Wakapi\Requests\GetUserProfile('furqatmashrabjonov'));
    return response()->json($user->json());
});

Route::get('fitbit', function () {
    $connector = new \App\Http\Integrations\Fitbit\FitbitConnector();
    return redirect($connector->getAuthorizationUrl());
});


Route::get('reverb', function (){
    TestEvent::dispatch();
});
