<?php

use Illuminate\Support\Collection;
use App\Services\Integrations\Services\Integrations\Contracts\LeetcodeServiceInterface;

test('can get user profile', function () {
    $service = app(LeetcodeServiceInterface::class);

    $user = $service->getUser('furqatmashrabjonov');

    expect($user->username)->toBe('FurqatMashrabjonov')
        ->and(fn () => $service->getUser('wrong_username_that_does_not_exist'))
        ->toThrow(Exception::class);
})->skip(env('CI') ?? false, 'Skipped in CI')
    ->expect(true)->toBeTrue();

test('can get user recent submissions', function () {
    $service = app(LeetcodeServiceInterface::class);

    $submissions = $service->getUserRecentSubmissions('furqatmashrabjonov');

    expect($submissions)->toBeInstanceOf(Collection::class)
        ->and($submissions->first())->toHaveKeys(['title', 'title_slug', 'status_display', 'date'])
        ->and(fn () => $service->getUserRecentSubmissions('wrong_username_that_does_not_exist'))
        ->toThrow(Exception::class);
})->skip(env('CI') ?? false, 'Skipped in CI')
    ->expect(true)->toBeTrue();
