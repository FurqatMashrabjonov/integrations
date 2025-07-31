<?php

use App\Models\User;
use App\Models\DailyStat;
use App\Models\DailyStatMetric;

beforeEach(function () {
    $this->user      = User::factory()->create();
    $this->otherUser = User::factory()->create();

    // Reset the faker unique state for each test
    $this->faker = Faker\Factory::create();
    $this->faker->unique(true);
});

describe('Daily Stats API', function () {
    test('can list daily stats with pagination', function () {
        // Create stats with different dates to avoid unique constraint violations
        for ($i = 0; $i < 25; $i++) {
            DailyStat::factory()->forDate(now()->subDays($i)->format('Y-m-d'))->create([
                'user_id'  => $this->user->id,
                'provider' => 'github',
            ]);
        }

        $response = $this->getJson('/api/daily-stats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data',
                    'current_page',
                    'per_page',
                    'total',
                ],
                'message',
            ]);

        expect($response->json('data.per_page'))->toBe(15);
        expect($response->json('data.data'))->toHaveCount(15);
    });

    test('can filter daily stats by user', function () {
        DailyStat::factory()->forDate('2025-07-01')->create(['user_id' => $this->user->id, 'provider' => 'github']);
        DailyStat::factory()->forDate('2025-07-02')->create(['user_id' => $this->user->id, 'provider' => 'leetcode']);
        DailyStat::factory()->forDate('2025-07-03')->create(['user_id' => $this->user->id, 'provider' => 'wakapi']);
        DailyStat::factory()->forDate('2025-07-01')->create(['user_id' => $this->otherUser->id, 'provider' => 'github']);
        DailyStat::factory()->forDate('2025-07-02')->create(['user_id' => $this->otherUser->id, 'provider' => 'leetcode']);

        $response = $this->getJson("/api/daily-stats?user_id={$this->user->id}");

        $response->assertStatus(200);

        $data = $response->json('data.data');
        expect($data)->toHaveCount(3);

        foreach ($data as $stat) {
            expect($stat['user_id'])->toBe($this->user->id);
        }
    });

    test('can filter daily stats by provider', function () {
        DailyStat::factory()->forDate('2025-07-01')->create(['user_id' => $this->user->id, 'provider' => 'github']);
        DailyStat::factory()->forDate('2025-07-02')->create(['user_id' => $this->user->id, 'provider' => 'github']);
        DailyStat::factory()->forDate('2025-07-03')->create(['user_id' => $this->user->id, 'provider' => 'leetcode']);
        DailyStat::factory()->forDate('2025-07-04')->create(['user_id' => $this->user->id, 'provider' => 'leetcode']);
        DailyStat::factory()->forDate('2025-07-05')->create(['user_id' => $this->user->id, 'provider' => 'leetcode']);

        $response = $this->getJson('/api/daily-stats?provider=github');

        $response->assertStatus(200);

        $data = $response->json('data.data');
        expect($data)->toHaveCount(2);

        foreach ($data as $stat) {
            expect($stat['provider'])->toBe('github');
        }
    });

    test('can filter daily stats by date range', function () {
        DailyStat::factory()->forDate('2025-07-01')->create(['user_id' => $this->user->id, 'provider' => 'github']);
        DailyStat::factory()->forDate('2025-07-15')->create(['user_id' => $this->user->id, 'provider' => 'leetcode']);
        DailyStat::factory()->forDate('2025-08-01')->create(['user_id' => $this->user->id, 'provider' => 'wakapi']);

        $response = $this->getJson('/api/daily-stats?start_date=2025-07-01&end_date=2025-07-31');

        $response->assertStatus(200);

        $data = $response->json('data.data');
        expect($data)->toHaveCount(2);
    });

    test('can filter daily stats by specific date', function () {
        DailyStat::factory()->forDate('2025-07-31')->create(['user_id' => $this->user->id, 'provider' => 'github']);
        DailyStat::factory()->forDate('2025-07-31')->create(['user_id' => $this->user->id, 'provider' => 'leetcode']);
        DailyStat::factory()->forDate('2025-07-30')->create(['user_id' => $this->user->id, 'provider' => 'github']);

        $response = $this->getJson('/api/daily-stats?date=2025-07-31');

        $response->assertStatus(200);

        $data = $response->json('data.data');
        expect($data)->toHaveCount(2);

        foreach ($data as $stat) {
            expect($stat['date'])->toStartWith('2025-07-31');
        }
    });

    test('can filter daily stats by recent days', function () {
        // Create stats for the last 5 days
        for ($i = 1; $i <= 5; $i++) {
            DailyStat::factory()->forDate(now()->subDays($i)->format('Y-m-d'))->create([
                'user_id'  => $this->user->id,
                'provider' => $i % 2 ? 'github' : 'leetcode', // Alternate providers
            ]);
        }

        // Create an old stat
        DailyStat::factory()->forDate(now()->subDays(40)->format('Y-m-d'))->create([
            'user_id'  => $this->user->id,
            'provider' => 'wakapi',
        ]);

        $response = $this->getJson('/api/daily-stats?recent_days=7');

        $response->assertStatus(200);

        $data = $response->json('data.data');
        expect($data)->toHaveCount(5);
    });

    test('can sort daily stats', function () {
        DailyStat::factory()->forDate('2025-07-01')->create(['user_id' => $this->user->id, 'provider' => 'github']);
        DailyStat::factory()->forDate('2025-07-02')->create(['user_id' => $this->user->id, 'provider' => 'leetcode']);
        DailyStat::factory()->forDate('2025-07-03')->create(['user_id' => $this->user->id, 'provider' => 'wakapi']);

        $response = $this->getJson('/api/daily-stats?sort_by=date&sort_order=asc');

        $response->assertStatus(200);

        $data = $response->json('data.data');
        expect($data[0]['date'])->toStartWith('2025-07-01');
        expect($data[1]['date'])->toStartWith('2025-07-02');
        expect($data[2]['date'])->toStartWith('2025-07-03');
    });

    test('can show specific daily stat with metrics and user', function () {
        $dailyStat = DailyStat::factory()->create(['user_id' => $this->user->id]);
        DailyStatMetric::factory()->count(3)->create(['daily_stat_id' => $dailyStat->id]);

        $response = $this->getJson("/api/daily-stats/{$dailyStat->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'user_id',
                    'date',
                    'provider',
                    'meta',
                    'metrics',
                    'user',
                ],
                'message',
            ]);

        expect($response->json('data.metrics'))->toHaveCount(3);
        expect($response->json('data.user.id'))->toBe($this->user->id);
    });

    test('returns 404 for non-existent daily stat', function () {
        $response = $this->getJson('/api/daily-stats/999999');

        $response->assertStatus(404);
    });

    test('can get aggregated stats for user', function () {
        $dailyStat1 = DailyStat::factory()->forDate('2025-07-01')->create(['user_id' => $this->user->id, 'provider' => 'github']);
        $dailyStat2 = DailyStat::factory()->forDate('2025-07-02')->create(['user_id' => $this->user->id, 'provider' => 'github']);

        DailyStatMetric::factory()->ofType('commit_count')->create([
            'daily_stat_id' => $dailyStat1->id,
            'value'         => 10,
        ]);
        DailyStatMetric::factory()->ofType('commit_count')->create([
            'daily_stat_id' => $dailyStat2->id,
            'value'         => 15,
        ]);
        DailyStatMetric::factory()->ofType('pr_count')->create([
            'daily_stat_id' => $dailyStat1->id,
            'value'         => 2,
        ]);

        $response = $this->getJson("/api/daily-stats-aggregated?user_id={$this->user->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'commit_count' => [
                        'total',
                        'count',
                        'average',
                        'unit',
                        'values',
                    ],
                    'pr_count',
                ],
                'message',
            ]);

        $commitData = $response->json('data.commit_count');
        expect($commitData['total'])->toBe(25)
            ->and($commitData['count'])->toBe(2)
            ->and($commitData['average'])->toBe(12.5)
            ->and($commitData['values'])->toHaveCount(2);
    });

    test('can filter aggregated stats by provider', function () {
        $githubStat   = DailyStat::factory()->forDate('2025-07-01')->create(['user_id' => $this->user->id, 'provider' => 'github']);
        $leetcodeStat = DailyStat::factory()->forDate('2025-07-02')->create(['user_id' => $this->user->id, 'provider' => 'leetcode']);

        DailyStatMetric::factory()->ofType('commit_count')->create([
            'daily_stat_id' => $githubStat->id,
            'value'         => 10,
        ]);
        DailyStatMetric::factory()->ofType('problems_easy')->create([
            'daily_stat_id' => $leetcodeStat->id,
            'value'         => 5,
        ]);

        $response = $this->getJson("/api/daily-stats-aggregated?user_id={$this->user->id}&provider=github");

        $response->assertStatus(200);

        $data = $response->json('data');
        expect($data)->toHaveKey('commit_count');
        expect($data)->not()->toHaveKey('problems_easy');
    });

    test('can filter aggregated stats by date range', function () {
        $oldStat    = DailyStat::factory()->forDate('2025-06-01')->create(['user_id' => $this->user->id, 'provider' => 'github']);
        $recentStat = DailyStat::factory()->forDate('2025-07-15')->create(['user_id' => $this->user->id, 'provider' => 'github']);

        DailyStatMetric::factory()->ofType('commit_count')->create([
            'daily_stat_id' => $oldStat->id,
            'value'         => 5,
        ]);
        DailyStatMetric::factory()->ofType('commit_count')->create([
            'daily_stat_id' => $recentStat->id,
            'value'         => 10,
        ]);

        $response = $this->getJson("/api/daily-stats-aggregated?user_id={$this->user->id}&start_date=2025-07-01&end_date=2025-07-31");

        $response->assertStatus(200);

        $commitData = $response->json('data.commit_count');
        expect($commitData['total'])->toBe(10);
        expect($commitData['count'])->toBe(1);
    });

    test('can filter aggregated stats by specific metric type', function () {
        $dailyStat = DailyStat::factory()->create(['user_id' => $this->user->id]);

        DailyStatMetric::factory()->ofType('commit_count')->create([
            'daily_stat_id' => $dailyStat->id,
            'value'         => 10,
        ]);
        DailyStatMetric::factory()->ofType('pr_count')->create([
            'daily_stat_id' => $dailyStat->id,
            'value'         => 2,
        ]);

        $response = $this->getJson("/api/daily-stats-aggregated?user_id={$this->user->id}&metric_type=commit_count");

        $response->assertStatus(200);

        $data = $response->json('data');
        expect($data)->toHaveKey('commit_count');
        expect($data)->not()->toHaveKey('pr_count');
    });

    test('aggregated stats requires user_id', function () {
        $response = $this->getJson('/api/daily-stats-aggregated');

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['user_id']);
    });

    test('aggregated stats validates provider enum', function () {
        $response = $this->getJson("/api/daily-stats-aggregated?user_id={$this->user->id}&provider=invalid");

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['provider']);
    });
});

describe('Daily Stat Metrics API', function () {
    test('can list daily stat metrics with pagination', function () {
        $dailyStat = DailyStat::factory()->create();
        DailyStatMetric::factory()->count(20)->create(['daily_stat_id' => $dailyStat->id]);

        $response = $this->getJson('/api/daily-stat-metrics');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data',
                    'current_page',
                    'per_page',
                    'total',
                ],
                'message',
            ]);

        expect($response->json('data.per_page'))->toBe(15);
        expect($response->json('data.data'))->toHaveCount(15);
    });

    test('can filter metrics by daily stat id', function () {
        $dailyStat1 = DailyStat::factory()->create();
        $dailyStat2 = DailyStat::factory()->create();

        DailyStatMetric::factory()->count(3)->create(['daily_stat_id' => $dailyStat1->id]);
        DailyStatMetric::factory()->count(2)->create(['daily_stat_id' => $dailyStat2->id]);

        $response = $this->getJson("/api/daily-stat-metrics?daily_stat_id={$dailyStat1->id}");

        $response->assertStatus(200);

        $data = $response->json('data.data');
        expect($data)->toHaveCount(3);

        foreach ($data as $metric) {
            expect($metric['daily_stat_id'])->toBe($dailyStat1->id);
        }
    });

    test('can filter metrics by type', function () {
        $dailyStat = DailyStat::factory()->create();
        DailyStatMetric::factory()->ofType('commit_count')->count(2)->create(['daily_stat_id' => $dailyStat->id]);
        DailyStatMetric::factory()->ofType('pr_count')->count(3)->create(['daily_stat_id' => $dailyStat->id]);

        $response = $this->getJson('/api/daily-stat-metrics?type=commit_count');

        $response->assertStatus(200);

        $data = $response->json('data.data');
        expect($data)->toHaveCount(2);

        foreach ($data as $metric) {
            expect($metric['type'])->toBe('commit_count');
        }
    });

    test('can filter metrics by unit', function () {
        $dailyStat = DailyStat::factory()->create();
        DailyStatMetric::factory()->count(2)->create([
            'daily_stat_id' => $dailyStat->id,
            'unit'          => 'count',
        ]);
        DailyStatMetric::factory()->count(3)->create([
            'daily_stat_id' => $dailyStat->id,
            'unit'          => 'minutes',
        ]);

        $response = $this->getJson('/api/daily-stat-metrics?unit=count');

        $response->assertStatus(200);

        $data = $response->json('data.data');
        expect($data)->toHaveCount(2);

        foreach ($data as $metric) {
            expect($metric['unit'])->toBe('count');
        }
    });

    test('can filter metrics by value range', function () {
        $dailyStat = DailyStat::factory()->create();
        DailyStatMetric::factory()->create([
            'daily_stat_id' => $dailyStat->id,
            'value'         => 5,
        ]);
        DailyStatMetric::factory()->create([
            'daily_stat_id' => $dailyStat->id,
            'value'         => 15,
        ]);
        DailyStatMetric::factory()->create([
            'daily_stat_id' => $dailyStat->id,
            'value'         => 25,
        ]);

        $response = $this->getJson('/api/daily-stat-metrics?min_value=10&max_value=20');

        $response->assertStatus(200);

        $data = $response->json('data.data');
        expect($data)->toHaveCount(1);
        expect($data[0]['value'])->toBe(15);
    });

    test('can sort metrics', function () {
        $dailyStat = DailyStat::factory()->create();
        DailyStatMetric::factory()->create([
            'daily_stat_id' => $dailyStat->id,
            'value'         => 30,
        ]);
        DailyStatMetric::factory()->create([
            'daily_stat_id' => $dailyStat->id,
            'value'         => 10,
        ]);
        DailyStatMetric::factory()->create([
            'daily_stat_id' => $dailyStat->id,
            'value'         => 20,
        ]);

        $response = $this->getJson('/api/daily-stat-metrics?sort_by=value&sort_order=asc');

        $response->assertStatus(200);

        $data = $response->json('data.data');
        expect($data[0]['value'])->toBe(10);
        expect($data[1]['value'])->toBe(20);
        expect($data[2]['value'])->toBe(30);
    });

    test('can show specific daily stat metric', function () {
        $dailyStat = DailyStat::factory()->create();
        $metric    = DailyStatMetric::factory()->create(['daily_stat_id' => $dailyStat->id]);

        $response = $this->getJson("/api/daily-stat-metrics/{$metric->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'daily_stat_id',
                    'type',
                    'value',
                    'unit',
                    'meta',
                    'daily_stat',
                ],
                'message',
            ]);

        expect($response->json('data.daily_stat.id'))->toBe($dailyStat->id);
    });

    test('returns 404 for non-existent metric', function () {
        $response = $this->getJson('/api/daily-stat-metrics/999999');

        $response->assertStatus(404);
    });

    test('can get metrics grouped by type', function () {
        $dailyStat = DailyStat::factory()->create();

        DailyStatMetric::factory()->ofType('commit_count')->create([
            'daily_stat_id' => $dailyStat->id,
            'value'         => 10,
        ]);
        DailyStatMetric::factory()->ofType('commit_count')->create([
            'daily_stat_id' => $dailyStat->id,
            'value'         => 15,
        ]);
        DailyStatMetric::factory()->ofType('pr_count')->create([
            'daily_stat_id' => $dailyStat->id,
            'value'         => 2,
        ]);

        $response = $this->getJson('/api/daily-stat-metrics-by-type');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'commit_count' => [
                        'count',
                        'total',
                        'average',
                        'min',
                        'max',
                        'unit',
                        'metrics',
                    ],
                    'pr_count',
                ],
                'message',
            ]);

        $commitData = $response->json('data.commit_count');
        expect($commitData['count'])->toBe(2)
            ->and($commitData['total'])->toBe(25)
            ->and($commitData['average'])->toBe(12.5)
            ->and($commitData['min'])->toBe(10)
            ->and($commitData['max'])->toBe(15)
            ->and($commitData['metrics'])->toHaveCount(2);
    });

    test('can filter grouped metrics by daily stat id', function () {
        $dailyStat1 = DailyStat::factory()->create();
        $dailyStat2 = DailyStat::factory()->create();

        DailyStatMetric::factory()->ofType('commit_count')->create([
            'daily_stat_id' => $dailyStat1->id,
            'value'         => 10,
        ]);
        DailyStatMetric::factory()->ofType('commit_count')->create([
            'daily_stat_id' => $dailyStat2->id,
            'value'         => 20,
        ]);

        $response = $this->getJson("/api/daily-stat-metrics-by-type?daily_stat_id={$dailyStat1->id}");

        $response->assertStatus(200);

        $commitData = $response->json('data.commit_count');
        expect($commitData['count'])->toBe(1);
        expect($commitData['total'])->toBe(10);
    });

    test('can filter grouped metrics by date range', function () {
        $oldStat    = DailyStat::factory()->forDate('2025-06-01')->create();
        $recentStat = DailyStat::factory()->forDate('2025-07-15')->create();

        DailyStatMetric::factory()->ofType('commit_count')->create([
            'daily_stat_id' => $oldStat->id,
            'value'         => 5,
        ]);
        DailyStatMetric::factory()->ofType('commit_count')->create([
            'daily_stat_id' => $recentStat->id,
            'value'         => 10,
        ]);

        $response = $this->getJson('/api/daily-stat-metrics-by-type?start_date=2025-07-01&end_date=2025-07-31');

        $response->assertStatus(200);

        $commitData = $response->json('data.commit_count');
        expect($commitData['count'])->toBe(1);
        expect($commitData['total'])->toBe(10);
    });
});

describe('Model Relationships and Scopes', function () {
    test('daily stat has metrics relationship', function () {
        $dailyStat = DailyStat::factory()->create();
        $metrics   = DailyStatMetric::factory()->count(3)->create(['daily_stat_id' => $dailyStat->id]);

        expect($dailyStat->metrics)->toHaveCount(3);
        expect($dailyStat->metrics->first())->toBeInstanceOf(DailyStatMetric::class);
    });

    test('daily stat has user relationship', function () {
        $dailyStat = DailyStat::factory()->create(['user_id' => $this->user->id]);

        expect($dailyStat->user)->toBeInstanceOf(User::class);
        expect($dailyStat->user->id)->toBe($this->user->id);
    });

    test('daily stat metric has daily stat relationship', function () {
        $dailyStat = DailyStat::factory()->create();
        $metric    = DailyStatMetric::factory()->create(['daily_stat_id' => $dailyStat->id]);

        expect($metric->dailyStat)->toBeInstanceOf(DailyStat::class);
        expect($metric->dailyStat->id)->toBe($dailyStat->id);
    });

    //    test('daily stat scopes work correctly', function () {
    //        $user1Stats = DailyStat::factory()->count(2)->create(['user_id' => $this->user->id]);
    //        $user2Stats = DailyStat::factory()->count(3)->create(['user_id' => $this->otherUser->id]);
    //        $githubStats = DailyStat::factory()->github()->create();
    //        $todayStats = DailyStat::factory()->today()->count(1)->create();
    //
    //        expect(DailyStat::byUser($this->user->id)->count())->toBe(2);
    //            expect(DailyStat::byProvider('github')->count())->toBe(1);
    //            expect(DailyStat::byDate(now())->count())->toBe(1);
    //            expect(DailyStat::recent(30)->count())->toBeGreaterThan(0);
    //    });

    //    test('daily stat metric scopes work correctly', function () {
    //        $dailyStat = DailyStat::factory()->create();
    //        DailyStatMetric::factory()->ofType('commit_count')->count(2)->create(['daily_stat_id' => $dailyStat->id]);
    //        DailyStatMetric::factory()->count(3)->create([
    //            'daily_stat_id' => $dailyStat->id,
    //            'unit'          => 'minutes',
    //        ]);
    //
    //        expect(DailyStatMetric::byType('commit_count')->count())->toBe(2);
    //        expect(DailyStatMetric::byUnit('minutes')->count())->toBe(3);
    //    });

    test('daily stat helper methods work correctly', function () {
        $dailyStat = DailyStat::factory()->create();
        DailyStatMetric::factory()->ofType('commit_count')->create([
            'daily_stat_id' => $dailyStat->id,
            'value'         => 15,
        ]);
        DailyStatMetric::factory()->ofType('pr_count')->create([
            'daily_stat_id' => $dailyStat->id,
            'value'         => 3,
        ]);

        expect($dailyStat->getMetricValue('commit_count'))->toBe(15.0);
        expect($dailyStat->getMetricValue('non_existent'))->toBeNull();
        expect($dailyStat->hasMetric('commit_count'))->toBeTrue();
        expect($dailyStat->hasMetric('non_existent'))->toBeFalse();

        $values = $dailyStat->getMetricValues();
        expect($values['commit_count'])->toBe(15.0);
        expect($values['pr_count'])->toBe(3.0);
    });

    test('daily stat metric helper methods work correctly', function () {
        $metric = DailyStatMetric::factory()->create([
            'value' => 15.75,
            'unit'  => 'minutes',
            'meta'  => ['language' => 'PHP', 'project' => 'test'],
        ]);

        expect($metric->getFormattedValueAttribute())->toBe('15.75 minutes');
        expect($metric->hasMeta())->toBeTrue();
        expect($metric->getMetaValue('language'))->toBe('PHP');
        expect($metric->getMetaValue('non_existent'))->toBeNull();
    });
});

describe('Database Constraints', function () {
    test('daily stat enforces unique constraint on user date provider', function () {
        DailyStat::factory()->create([
            'user_id'  => $this->user->id,
            'date'     => '2025-07-31',
            'provider' => 'github',
        ]);

        expect(function () {
            DailyStat::factory()->create([
                'user_id'  => $this->user->id,
                'date'     => '2025-07-31',
                'provider' => 'github',
            ]);
        })->toThrow(Illuminate\Database\QueryException::class);
    });

    test('can create same date provider for different users', function () {
        DailyStat::factory()->create([
            'user_id'  => $this->user->id,
            'date'     => '2025-07-31',
            'provider' => 'github',
        ]);

        $stat2 = DailyStat::factory()->create([
            'user_id'  => $this->otherUser->id,
            'date'     => '2025-07-31',
            'provider' => 'github',
        ]);

        expect($stat2)->toBeInstanceOf(DailyStat::class);
    });

    test('daily stat metric cascades delete with daily stat', function () {
        $dailyStat = DailyStat::factory()->create();
        $metrics   = DailyStatMetric::factory()->count(3)->create(['daily_stat_id' => $dailyStat->id]);

        expect(DailyStatMetric::where('daily_stat_id', $dailyStat->id)->count())->toBe(3);

        $dailyStat->delete();

        expect(DailyStatMetric::where('daily_stat_id', $dailyStat->id)->count())->toBe(0);
    });
});
