<?php

namespace App\Services\Integrations;

use App\Http\Integrations\Leetcode\Requests\GetProblemDifficulty;
use Saloon\Http\Request;
use App\Models\DailyStat;
use App\Enums\IntegrationEnum;
use App\Models\DailyStatMetric;
use App\Models\IntegrationAccount;
use Illuminate\Support\Collection;
use Saloon\Exceptions\Request\RequestException;
use Saloon\Exceptions\Request\FatalRequestException;
use App\Http\Integrations\Leetcode\LeetcodeConnector;
use App\Http\Integrations\Leetcode\Dtos\UserProfileData;
use App\Http\Integrations\Leetcode\Requests\GetUserProfile;
use App\Repositories\Contracts\DailyStatRepositoryInterface;
use App\Repositories\Contracts\DailyStatMetricRepositoryInterface;
use App\Http\Integrations\Leetcode\Requests\GetUserRecentSubmissions;
use App\Services\Integrations\Services\Integrations\Contracts\LeetcodeServiceInterface;

class LeetcodeService implements LeetcodeServiceInterface
{
    public function __construct(
        private LeetcodeConnector $connector,
        private DailyStatRepositoryInterface $dailyStatRepository,
        private DailyStatMetricRepositoryInterface $dailyStatMetricRepository
    ) {}

    /**
     * @throws FatalRequestException
     * @throws RequestException
     * @throws \JsonException
     * @throws \Exception
     * @throws \Throwable
     */
    public function getUser(string $username): UserProfileData
    {
        $user = $this->send(new GetUserProfile($username))?->data?->matchedUser;

        throw_if(!$user, new \Exception('Leetcode servisida "' . $username . '" foydalanuvchi topilmadi'));

        $ac_submissions = collect($user->submitStatsGlobal?->acSubmissionNum);

        return new UserProfileData(
            username: $user->username,
            real_name: $user->profile->realName,
            user_avatar: $user->profile->userAvatar,
            ranking: $user->profile->ranking,
            badges: (array) $user->badges,
            ac_submission_num_easy: $ac_submissions->where('difficulty', 'Easy')->first()->count ?? 0,
            ac_submission_num_medium: $ac_submissions->where('difficulty', 'Medium')->first()->count ?? 0,
            ac_submission_num_hard: $ac_submissions->where('difficulty', 'Hard')->first()->count ?? 0,
        );
    }

    /**
     * @throws \Throwable
     * @throws FatalRequestException
     * @throws RequestException
     * @throws \JsonException
     */
    public function getUserRecentSubmissions(string $username, ?string $date = null): Collection
    {
        $user = $this->send(new GetUserRecentSubmissions($username))?->data;
        throw_if(!$user?->matchedUser?->username, new \Exception('Leetcode servisida "' . $username . '" foydalanuvchi topilmadi'));

        return collect($user->recentAcSubmissionList ?? [])
            ->when($date, function ($query) use ($date) {
                return $query->filter(fn ($sub) => $sub->timestamp && date('Y-m-d', $sub->timestamp) === $date);
            });
    }

    public function getProblemDifficulty(string $titleSlug): string
    {
        $response = $this->send(new GetProblemDifficulty($titleSlug));

        return $response->object();
    }

    /**
     * @throws FatalRequestException
     * @throws RequestException
     * @throws \JsonException
     */
    private function send(Request $request)
    {
        $response = $this->connector->send($request);

        if ($response->successful()) {
            return $response->object();
        }
        dd($response->body());

        throw new \Exception('Failed to fetch data from Leetcode API');
    }

    public function store(int $userId, string $username): IntegrationAccount
    {
        return IntegrationAccount::updateOrCreate(
            [
                'user_id'     => $userId,
                'integration' => IntegrationEnum::LEETCODE,
            ],
            [
                'username' => $username,
                'data'     => null,
            ]
        );
    }

    public function exists(int $userId): bool
    {
        return IntegrationAccount::where('user_id', $userId)
            ->where('integration', IntegrationEnum::LEETCODE)
            ->exists();
    }

    public function destroy(int $userId): void
    {
        IntegrationAccount::where('user_id', $userId)
            ->where('integration', IntegrationEnum::LEETCODE)
            ->delete();
    }

    public function getAccount(int $userId)
    {
        return IntegrationAccount::where('user_id', $userId)
            ->where('integration', IntegrationEnum::LEETCODE)
            ->first();
    }

    public function syncProfile(int $userId): void
    {
        $integrationAccount = IntegrationAccount::where('user_id', $userId)
            ->where('integration', IntegrationEnum::LEETCODE)
            ->first();

        if (!$integrationAccount) {
            throw new \Exception('LeetCode integration account not found for user');
        }

        $username = $integrationAccount->data['username'] ?? null;
        if (!$username) {
            throw new \Exception('LeetCode username not found in integration account data');
        }

        // This method can be implemented later if needed
        // For now it's just a placeholder to satisfy the interface
    }

    /**
     * Store daily Leetcode statistics
     *
     * @throws \Exception
     */
    public function storeDailyStats(int $userId, ?string $date = null): DailyStat
    {
        $date ??= now()->format('Y-m-d');

        // Use IntegrationAccount instead of old repository
        $integrationAccount = IntegrationAccount::where('user_id', $userId)
            ->where('integration', IntegrationEnum::LEETCODE)
            ->first();

        if (!$integrationAccount) {
            throw new \Exception('LeetCode integration account not found for user');
        }

        $username = $integrationAccount->data['username'] ?? null;
        if (!$username) {
            throw new \Exception('LeetCode username not found in integration account data');
        }

        // Get user profile and recent submissions for the specific date
        $profile           = $this->getUser($username);
        $recentSubmissions = $this->getUserRecentSubmissions($username, $date);

        $totalSubmissions = $recentSubmissions->count();

        // Get profile data for total stats
        $profileData = $integrationAccount->data['profile'] ?? [];
        $totalEasy   = $profileData['ac_submission_num_easy'] ?? 0;
        $totalMedium = $profileData['ac_submission_num_medium'] ?? 0;
        $totalHard   = $profileData['ac_submission_num_hard'] ?? 0;

        // Create or update daily stat using repository
        $dailyStat = $this->dailyStatRepository->updateOrCreate(
            [
                'user_id'  => $userId,
                'date'     => $date . ' 00:00:00',
                'provider' => 'leetcode',
            ],
            [
                'meta' => [
                    'username'           => $username,
                    'ranking'            => $profileData['ranking'] ?? $profile->ranking,
                    'total_easy'         => $totalEasy,
                    'total_medium'       => $totalMedium,
                    'total_hard'         => $totalHard,
                    'badges_count'       => count($profileData['badges'] ?? []),
                    'submissions_today'  => $totalSubmissions,
                    'submissions_detail' => $recentSubmissions->toArray(),
                ],
            ]
        );

        // Create or update metrics using repository
        $this->createOrUpdateMetric($dailyStat->id, 'problems_solved_today', $totalSubmissions, 'count', [
            'submissions' => $recentSubmissions->toArray(),
        ]);

        $this->createOrUpdateMetric($dailyStat->id, 'total_problems_easy', $totalEasy, 'count', [
            'difficulty' => 'Easy',
        ]);

        $this->createOrUpdateMetric($dailyStat->id, 'total_problems_medium', $totalMedium, 'count', [
            'difficulty' => 'Medium',
        ]);

        $this->createOrUpdateMetric($dailyStat->id, 'total_problems_hard', $totalHard, 'count', [
            'difficulty' => 'Hard',
        ]);

        $this->createOrUpdateMetric($dailyStat->id, 'ranking', $profile->ranking, 'position', [
            'total_problems_solved' => $totalEasy + $totalMedium + $totalHard,
        ]);

        return $dailyStat->load('metrics');
    }

    /**
     * Get daily stats for a user
     */
    public function getDailyStats(int $userId, ?string $date = null): ?DailyStat
    {
        $date ??= now()->format('Y-m-d');

        return $this->dailyStatRepository->findByUserAndProviderAndDate($userId, 'leetcode', $date);
    }

    /**
     * Get daily stats for a date range
     */
    public function getDailyStatsRange(int $userId, string $startDate, string $endDate): Collection
    {
        return $this->dailyStatRepository->findByUserProviderAndDateRange($userId, 'leetcode', $startDate, $endDate);
    }

    /**
     * Get aggregated stats for a user
     */
    public function getAggregatedStats(int $userId, ?string $startDate = null, ?string $endDate = null): array
    {
        $startDate ??= now()->subDays(30)->format('Y-m-d');
        $endDate ??= now()->format('Y-m-d');

        $dailyStats = $this->getDailyStatsRange($userId, $startDate, $endDate);

        $metrics = $dailyStats->flatMap->metrics;

        $aggregated = [];

        foreach (['problems_easy', 'problems_medium', 'problems_hard', 'total_submissions'] as $metricType) {
            $typeMetrics = $metrics->where('type', $metricType);

            if ($typeMetrics->isNotEmpty()) {
                $aggregated[$metricType] = [
                    'total'        => $typeMetrics->sum('value'),
                    'average'      => $typeMetrics->avg('value'),
                    'max_daily'    => $typeMetrics->max('value'),
                    'days_active'  => $typeMetrics->where('value', '>', 0)->count(),
                    'unit'         => $typeMetrics->first()->unit,
                    'daily_values' => $typeMetrics->map(fn ($m) => [
                        'date'  => $m->dailyStat->date->format('Y-m-d'),
                        'value' => $m->value,
                    ])->toArray(),
                ];
            }
        }

        return [
            'period' => [
                'start_date' => $startDate,
                'end_date'   => $endDate,
                'total_days' => $dailyStats->count(),
            ],
            'metrics' => $aggregated,
            'streak'  => $this->calculateSubmissionStreak($dailyStats),
            'summary' => [
                'most_productive_day'    => $this->getMostProductiveDay($dailyStats),
                'total_problems_solved'  => $aggregated['total_submissions']['total'] ?? 0,
                'average_daily_problems' => $aggregated['total_submissions']['average'] ?? 0,
            ],
        ];
    }

    /**
     * Sync daily stats (typically called by cron job)
     */
    public function syncDailyStats(int $userId, ?string $date = null): DailyStat
    {
        return $this->storeDailyStats($userId, $date);
    }

    /**
     * Helper method to create or update metrics using repository
     */
    private function createOrUpdateMetric(int $dailyStatId, string $type, float $value, ?string $unit = null, array $meta = []): DailyStatMetric
    {
        return $this->dailyStatMetricRepository->updateOrCreate(
            [
                'daily_stat_id' => $dailyStatId,
                'type'          => $type,
            ],
            [
                'value' => $value,
                'unit'  => $unit,
                'meta'  => $meta,
            ]
        );
    }

    /**
     * Calculate submission streak
     */
    private function calculateSubmissionStreak(Collection $dailyStats): array
    {
        $currentStreak = 0;
        $longestStreak = 0;
        $tempStreak    = 0;

        $dailyStats->sortBy('date')->each(function ($stat) use (&$currentStreak, &$longestStreak, &$tempStreak) {
            $totalSubmissions = $stat->metrics->where('type', 'total_submissions')->first()?->value ?? 0;

            if ($totalSubmissions > 0) {
                $tempStreak++;
                $longestStreak = max($longestStreak, $tempStreak);

                // If this is today or yesterday, count towards current streak
                if ($stat->date->isToday() || $stat->date->isYesterday()) {
                    $currentStreak = $tempStreak;
                }
            } else {
                $tempStreak = 0;
                if (!$stat->date->isToday() && !$stat->date->isYesterday()) {
                    $currentStreak = 0;
                }
            }
        });

        return [
            'current_streak' => $currentStreak,
            'longest_streak' => $longestStreak,
        ];
    }

    /**
     * Get most productive day
     */
    private function getMostProductiveDay(Collection $dailyStats): ?array
    {
        $mostProductive = $dailyStats->map(function ($stat) {
            $totalSubmissions = $stat->metrics->where('type', 'total_submissions')->first()?->value ?? 0;

            return [
                'date'        => $stat->date->format('Y-m-d'),
                'submissions' => $totalSubmissions,
                'easy'        => $stat->metrics->where('type', 'problems_easy')->first()?->value ?? 0,
                'medium'      => $stat->metrics->where('type', 'problems_medium')->first()?->value ?? 0,
                'hard'        => $stat->metrics->where('type', 'problems_hard')->first()?->value ?? 0,
            ];
        })->sortByDesc('submissions')->first();

        return $mostProductive && $mostProductive['submissions'] > 0 ? $mostProductive : null;
    }
}
