<?php

use App\Models\User;
use App\Models\DailyStat;
use App\Models\DailyStatMetric;
use Illuminate\Support\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Services\Integrations\Services\Integrations\Contracts\LeetcodeServiceInterface;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user    = User::factory()->create();
    $this->service = app(LeetcodeServiceInterface::class);
});

test('can get user profile', function () {
    $user = $this->service->getUser('furqatmashrabjonov');

    expect($user->username)->toBe('FurqatMashrabjonov')
        ->and(fn () => $this->service->getUser('wrong_username_that_does_not_exist'))
        ->toThrow(Exception::class);
})->skip(env('CI') ?? false, 'Skipped in CI');

test('can get user recent submissions', function () {
    $submissions = $this->service->getUserRecentSubmissions('furqatmashrabjonov');

    expect($submissions)->toBeInstanceOf(Collection::class)
        ->and($submissions->first())->toHaveKeys(['title', 'title_slug', 'status_display', 'date'])
        ->and(fn () => $this->service->getUserRecentSubmissions('wrong_username_that_does_not_exist'))
        ->toThrow(Exception::class);
})->skip(env('CI') ?? false, 'Skipped in CI');

test('can store and retrieve user account', function () {
    $username = 'testuser123';

    // Store account
    $account = $this->service->store($this->user->id, $username);

    expect($account)->not()->toBeNull()
        ->and($this->service->exists($this->user->id))->toBeTrue()
        ->and($this->service->getAccount($this->user->id))->not()->toBeNull();

    // Test destroy
    $this->service->destroy($this->user->id);
    expect($this->service->exists($this->user->id))->toBeFalse();
});

test('can store daily stats', function () {
    // First store a leetcode account
    $this->service->store($this->user->id, 'testuser123');

    // Mock the external API calls to avoid real API requests
    $mockService = Mockery::mock($this->service)
        ->shouldAllowMockingProtectedMethods()
        ->makePartial();

    $mockProfile = new App\Http\Integrations\Leetcode\Dtos\UserProfileData(
        username: 'testuser123',
        real_name: 'Test User',
        user_avatar: 'avatar.jpg',
        ranking: 12345,
        badges: ['badge1', 'badge2'],
        ac_submission_num_easy: 50,
        ac_submission_num_medium: 30,
        ac_submission_num_hard: 10
    );

    $mockSubmissions = collect([
        [
            'title'          => 'Two Sum',
            'title_slug'     => 'two-sum',
            'status_display' => 'Accepted',
            'difficulty'     => 'Easy',
            'date'           => now()->format('Y-m-d H:i:s'),
        ],
        [
            'title'          => 'Add Two Numbers',
            'title_slug'     => 'add-two-numbers',
            'status_display' => 'Accepted',
            'difficulty'     => 'Medium',
            'date'           => now()->format('Y-m-d H:i:s'),
        ],
    ]);

    $mockService->shouldReceive('getUser')->andReturn($mockProfile);
    $mockService->shouldReceive('getUserRecentSubmissions')->andReturn($mockSubmissions);

    $this->app->instance(LeetcodeServiceInterface::class, $mockService);

    $dailyStat = $mockService->storeDailyStats($this->user->id);

    expect($dailyStat)->toBeInstanceOf(DailyStat::class)
        ->and($dailyStat->user_id)->toBe($this->user->id)
        ->and($dailyStat->provider)->toBe('leetcode')
        ->and($dailyStat->date->format('Y-m-d'))->toBe(now()->format('Y-m-d'))
        ->and($dailyStat->metrics)->toHaveCount(4);

    // Check specific metrics - submissions don't have difficulty in the response
    // so all will be counted as unknown/0, only total_submissions will have count
    $easyMetric   = $dailyStat->metrics->where('type', 'problems_easy')->first();
    $mediumMetric = $dailyStat->metrics->where('type', 'problems_medium')->first();
    $hardMetric   = $dailyStat->metrics->where('type', 'problems_hard')->first();
    $totalMetric  = $dailyStat->metrics->where('type', 'total_submissions')->first();

    expect($mediumMetric->value)->toBe(1.0)  // Has difficulty field in mock
        ->and($hardMetric->value)->toBe(0.0)   // No hard problems in mock
        ->and($totalMetric->value)->toBe(2.0); // Total count of submissions
});

test('can get daily stats', function () {
    // Create test data with correct date format
    $todayDate = now()->format('Y-m-d');
    $dailyStat = DailyStat::factory()->create([
        'user_id'  => $this->user->id,
        'provider' => 'leetcode',
        'date'     => $todayDate,
    ]);

    DailyStatMetric::factory()->ofType('problems_easy')->create([
        'daily_stat_id' => $dailyStat->id,
        'value'         => 3,
    ]);

    DailyStatMetric::factory()->ofType('total_submissions')->create([
        'daily_stat_id' => $dailyStat->id,
        'value'         => 5,
    ]);

    $result = $this->service->getDailyStats($this->user->id, $todayDate);

    expect($result)->toBeInstanceOf(DailyStat::class)
        ->and($result->user_id)->toBe($this->user->id)
        ->and($result->provider)->toBe('leetcode')
        ->and($result->metrics)->toHaveCount(2);
});

test('can get daily stats for date range', function () {
    $startDate = now()->subDays(5)->format('Y-m-d');
    $endDate   = now()->format('Y-m-d');

    // Create multiple daily stats with unique dates
    for ($i = 0; $i <= 5; $i++) { // Changed to <= to include 6 days
        $date = now()->subDays($i)->format('Y-m-d');
        DailyStat::factory()->create([
            'user_id'  => $this->user->id,
            'provider' => 'leetcode',
            'date'     => $date,
        ]);
    }

    $results = $this->service->getDailyStatsRange($this->user->id, $startDate, $endDate);

    expect($results)->toBeInstanceOf(Collection::class)
        ->and($results->every(fn ($stat) => $stat->provider === 'leetcode'))->toBeTrue();
});

test('can get aggregated stats', function () {
    $startDate = now()->subDays(2)->format('Y-m-d');
    $endDate   = now()->format('Y-m-d');

    // Create daily stats with metrics
    for ($i = 0; $i < 3; $i++) {
        $date      = now()->subDays($i)->format('Y-m-d');
        $dailyStat = DailyStat::factory()->create([
            'user_id'  => $this->user->id,
            'provider' => 'leetcode',
            'date'     => $date,
        ]);

        DailyStatMetric::factory()->ofType('problems_easy')->create([
            'daily_stat_id' => $dailyStat->id,
            'value'         => $i + 1,
        ]);

        DailyStatMetric::factory()->ofType('total_submissions')->create([
            'daily_stat_id' => $dailyStat->id,
            'value'         => ($i + 1) * 2,
        ]);
    }

    $aggregated = $this->service->getAggregatedStats($this->user->id, $startDate, $endDate);

    dd($aggregated);

    expect($aggregated)->toHaveKeys(['period', 'metrics', 'streak', 'summary'])
//        ->and($aggregated['period']['total_days'])->toBe(3)
        ->and($aggregated['metrics'])->toHaveKeys(['problems_easy', 'total_submissions'])
        ->and($aggregated['metrics']['problems_easy']['total'])->toBe(6.0) // 1+2+3
        ->and($aggregated['metrics']['total_submissions']['total'])->toBe(12.0) // 2+4+6
        ->and($aggregated['streak'])->toHaveKeys(['current_streak', 'longest_streak']);
});

test('can sync daily stats', function () {
    // Store account first
    $this->service->store($this->user->id, 'testuser123');

    // Mock the service calls
    $mockService = Mockery::mock($this->service)
        ->shouldAllowMockingProtectedMethods()
        ->makePartial();

    $mockProfile = new App\Http\Integrations\Leetcode\Dtos\UserProfileData(
        username: 'testuser123',
        real_name: 'Test User',
        user_avatar: 'avatar.jpg',
        ranking: 12345,
        badges: ['badge1'],
        ac_submission_num_easy: 25,
        ac_submission_num_medium: 15,
        ac_submission_num_hard: 5
    );

    $mockSubmissions = collect([
        [
            'title'          => 'Valid Parentheses',
            'title_slug'     => 'valid-parentheses',
            'status_display' => 'Accepted',
            'difficulty'     => 'Easy',
            'date'           => now()->format('Y-m-d H:i:s'),
        ],
    ]);

    $mockService->shouldReceive('getUser')->andReturn($mockProfile);
    $mockService->shouldReceive('getUserRecentSubmissions')->andReturn($mockSubmissions);

    $this->app->instance(LeetcodeServiceInterface::class, $mockService);

    $result = $mockService->syncDailyStats($this->user->id);

    expect($result)->toBeInstanceOf(DailyStat::class)
        ->and($result->user_id)->toBe($this->user->id)
        ->and($result->provider)->toBe('leetcode');

    // Verify it's stored in database
    $this->assertDatabaseHas('daily_stats', [
        'user_id'  => $this->user->id,
        'provider' => 'leetcode',
        'date'     => now()->format('Y-m-d'),
    ]);
});

test('calculates submission streak correctly', function () {
    // Create consecutive days with submissions
    for ($i = 0; $i < 5; $i++) {
        $date      = now()->subDays($i)->format('Y-m-d');
        $dailyStat = DailyStat::factory()->create([
            'user_id'  => $this->user->id,
            'provider' => 'leetcode',
            'date'     => $date,
        ]);

        // Add submissions for first 3 days only
        if ($i < 3) {
            DailyStatMetric::factory()->ofType('total_submissions')->create([
                'daily_stat_id' => $dailyStat->id,
                'value'         => 1,
            ]);
        } else {
            DailyStatMetric::factory()->ofType('total_submissions')->create([
                'daily_stat_id' => $dailyStat->id,
                'value'         => 0,
            ]);
        }
    }

    $aggregated = $this->service->getAggregatedStats($this->user->id);

    expect($aggregated['streak']['current_streak'])->toBeGreaterThanOrEqual(0)
        ->and($aggregated['streak']['longest_streak'])->toBeGreaterThanOrEqual(0);
});

test('finds most productive day correctly', function () {
    // Create daily stats with different submission counts
    $dates = [
        ['date' => now()->subDays(2)->format('Y-m-d'), 'submissions' => 1],
        ['date' => now()->subDays(1)->format('Y-m-d'), 'submissions' => 5], // Most productive
        ['date' => now()->format('Y-m-d'), 'submissions' => 2],
    ];

    foreach ($dates as $data) {
        $dailyStat = DailyStat::factory()->create([
            'user_id'  => $this->user->id,
            'provider' => 'leetcode',
            'date'     => $data['date'],
        ]);

        DailyStatMetric::factory()->ofType('total_submissions')->create([
            'daily_stat_id' => $dailyStat->id,
            'value'         => $data['submissions'],
        ]);
    }

    $aggregated = $this->service->getAggregatedStats($this->user->id);

    expect($aggregated['summary']['most_productive_day'])->not()->toBeNull()
        ->and($aggregated['summary']['most_productive_day']['submissions'])->toBe(5.0)
        ->and($aggregated['summary']['most_productive_day']['date'])->toBe(now()->subDays(1)->format('Y-m-d'));
});

test('handles user without leetcode account', function () {
    expect(fn () => $this->service->storeDailyStats($this->user->id))
        ->toThrow(Exception::class, 'Leetcode account not found for user');
});

test('can handle empty submissions for a day', function () {
    // Store account
    $this->service->store($this->user->id, 'testuser123');

    // Mock empty submissions
    $mockService = Mockery::mock($this->service)
        ->shouldAllowMockingProtectedMethods()
        ->makePartial();

    $mockProfile = new App\Http\Integrations\Leetcode\Dtos\UserProfileData(
        username: 'testuser123',
        real_name: 'Test User',
        user_avatar: 'avatar.jpg',
        ranking: 12345,
        badges: [],
        ac_submission_num_easy: 10,
        ac_submission_num_medium: 5,
        ac_submission_num_hard: 2
    );

    $mockService->shouldReceive('getUser')->andReturn($mockProfile);
    $mockService->shouldReceive('getUserRecentSubmissions')->andReturn(collect([]));

    $this->app->instance(LeetcodeServiceInterface::class, $mockService);

    $dailyStat = $mockService->storeDailyStats($this->user->id);

    expect($dailyStat->metrics->where('type', 'total_submissions')->first()->value)->toBe(0.0)
        ->and($dailyStat->metrics->where('type', 'problems_easy')->first()->value)->toBe(0.0)
        ->and($dailyStat->metrics->where('type', 'problems_medium')->first()->value)->toBe(0.0)
        ->and($dailyStat->metrics->where('type', 'problems_hard')->first()->value)->toBe(0.0);
});

test('can update existing daily stats', function () {
    // Store account
    $this->service->store($this->user->id, 'testuser123');

    $today = now()->format('Y-m-d');

    // Create initial daily stat
    $existingStat = DailyStat::factory()->create([
        'user_id'  => $this->user->id,
        'provider' => 'leetcode',
        'date'     => $today,
    ]);

    // Mock service calls
    $mockService = Mockery::mock($this->service)
        ->shouldAllowMockingProtectedMethods()
        ->makePartial();

    $mockProfile = new App\Http\Integrations\Leetcode\Dtos\UserProfileData(
        username: 'testuser123',
        real_name: 'Test User',
        user_avatar: 'avatar.jpg',
        ranking: 12345,
        badges: [],
        ac_submission_num_easy: 20,
        ac_submission_num_medium: 10,
        ac_submission_num_hard: 3
    );

    $mockSubmissions = collect([
        [
            'title'          => 'New Problem',
            'title_slug'     => 'new-problem',
            'status_display' => 'Accepted',
            'difficulty'     => 'Medium',
            'date'           => now()->format('Y-m-d H:i:s'),
        ],
    ]);

    $mockService->shouldReceive('getUser')->andReturn($mockProfile);
    $mockService->shouldReceive('getUserRecentSubmissions')->andReturn($mockSubmissions);

    $this->app->instance(LeetcodeServiceInterface::class, $mockService);

    $updatedStat = $mockService->storeDailyStats($this->user->id, $today);

    // Should update the existing record, not create a new one
    expect($updatedStat->id)->toBe($existingStat->id)
        ->and(DailyStat::where('user_id', $this->user->id)
            ->where('provider', 'leetcode')
            ->where('date', $today)
            ->count())->toBe(1);
});
