<?php

//testing the FitbitService class

test('FitbitService can get user steps and store them', function () {
    \Illuminate\Support\Facades\Http::fake(
        [
            'https://api.fitbit.com/1/user/-/profile.json' => \Illuminate\Support\Facades\Http::response(
                [
                    'user' => [
                        'encodedId' => '12345',
                        'fullName' => 'Test User',
                        'displayName' => 'Test',
                    ],
                ],
                200
            ),
            'https://api.fitbit.com/1/user/-/activities/date/2023-10-01.json' => \Illuminate\Support\Facades\Http::response(
                [
                    'activities' => [
                        [
                            'dateTime' => '2023-10-01',
                            'value' => 10000,
                        ],
                    ],
                ],
                200
            ),
        ]
    );

    $fitbitService = app(\App\Services\Integrations\FitbitService::class);
    $userId = 1;
    $date = '2023-10-01';
    $steps = $fitbitService->getUserStepsAndStore($userId, $date);
    $this->assertNotNull($steps);
    $this->assertEquals(10000, $steps->value);
});
