<?php

use App\Http\Integrations\Github\Requests\GetUserCommits;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::any('github/callback', function (Request $request) {
    $connector = new \App\Http\Integrations\Github\GithubConnector();
    $authenticator = $connector->getAccessToken($request->code);
    echo $authenticator->getRefreshToken();
    $connector->authenticate($authenticator);

    dd($serialized = $authenticator->serialize(), \Saloon\Http\Auth\AccessTokenAuthenticator::unserialize($serialized));

//    dd($connector->getUser($authenticator)->body());
    $res = $connector->send(new GetUserCommits('furqatmashrabjonov', 'Leetcode'));

    dd($res->body());


    //    $accessToken = $authenticator->getAccessToken();
//    $refreshToken = $authenticator->getRefreshToken();
//    $expiresAt = $authenticator->getExpiresAt();
//
//    dd($accessToken, $refreshToken, $expiresAt);
//    $serialized = $authenticator->serialize();


//    \Saloon\Http\Auth\AccessTokenAuthenticator::unserialize($serialized);


});

Route::any('wakatime', function (Request $request) {
    Log::info('wakatime', $request->all());
});

Route::any('fitbit/callback', function (Request $request) {
    $connector = new \App\Http\Integrations\Fitbit\FitbitConnector();
    $authenticator = $connector->getAccessToken($request->code);
    $connector->authenticate($authenticator);

    dd($connector->getUser($authenticator)->body());
});
