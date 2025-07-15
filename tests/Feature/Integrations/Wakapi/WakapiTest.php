<?php

use App\Http\Integrations\Wakapi\Dtos\UserProfileData;
use App\Services\Integrations\Services\Integrations\Contracts\WakapiServiceInterface;

test('can get user profile', function () {
    $service = app(WakapiServiceInterface::class);
    $service->setToken(config('services.wakapi.token'));

    $user = $service->getUser();

    expect($user)->toBeInstanceOf(UserProfileData::class)
        ->and($user->username)->toBe('furqatmashrabjonov');

    // Test with invalid token
    $service = app(WakapiServiceInterface::class);
    $service->setToken('invalid_token');

    expect(fn () => $service->getUser())->toThrow(Exception::class);
});

//test('can get user activities', function () {
//    $service = app(WakapiServiceInterface::class);
//    $service->setToken(config('services.wakapi.token'));
//
//    $activities = $service->getDailyActivities();
//
//    dd($activities);
//});
