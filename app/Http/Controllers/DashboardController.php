<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\DailyStat;
use App\Enums\IntegrationEnum;
use Illuminate\Support\Facades\Auth;
use App\Services\IntegrationAccountService;

class DashboardController extends Controller
{
    public function __construct(
        private readonly IntegrationAccountService $integrationAccountService
    ) {}

    public function home()
    {
        return Inertia::render('welcome');
    }

    public function dashboard()
    {
        $user = Auth::user();

        // Get all integration data for all filters with consistent structure
        $integrationData = [
            'github' => [
                'isConnected' => $this->integrationAccountService->getByUserAndIntegration($user->id, IntegrationEnum::GITHUB) !== null,
                'profile'     => $this->getGithubProfile($user->id),
                'stats'       => [
                    'today'   => $this->getGithubStats($user->id, 'today'),
                    'weekly'  => $this->getGithubStats($user->id, 'weekly'),
                    'monthly' => $this->getGithubStats($user->id, 'monthly'),
                ],
            ],
            'fitbit' => [
                'isConnected' => $this->integrationAccountService->getByUserAndIntegration($user->id, IntegrationEnum::FITBIT) !== null,
                'profile'     => $this->getFitbitProfile($user->id),
                'stats'       => [
                    'today'   => $this->getFitbitStats($user->id, 'today'),
                    'weekly'  => $this->getFitbitStats($user->id, 'weekly'),
                    'monthly' => $this->getFitbitStats($user->id, 'monthly'),
                ],
            ],
            'leetcode' => [
                'isConnected' => $this->integrationAccountService->getByUserAndIntegration($user->id, IntegrationEnum::LEETCODE) !== null,
                'profile'     => $this->getLeetcodeProfile($user->id),
                'stats'       => [
                    'today'   => $this->getLeetcodeStats($user->id, 'today'),
                    'weekly'  => $this->getLeetcodeStats($user->id, 'weekly'),
                    'monthly' => $this->getLeetcodeStats($user->id, 'monthly'),
                ],
            ],
            'wakapi' => [
                'isConnected' => $this->integrationAccountService->getByUserAndIntegration($user->id, IntegrationEnum::WAKAPI) !== null,
                'profile'     => $this->getWakapiProfile($user->id),
                'stats'       => [
                    'today'   => $this->getWakapiStats($user->id, 'today'),
                    'weekly'  => $this->getWakapiStats($user->id, 'weekly'),
                    'monthly' => $this->getWakapiStats($user->id, 'monthly'),
                ],
            ],
        ];

        return Inertia::render('dashboard', [
            'integrationData' => $integrationData,
        ]);
    }

    /**
     * Get GitHub profile data
     */
    private function getGithubProfile(int $userId): ?array
    {
        $profile = $this->integrationAccountService->getGithubProfile($userId);

        if (!$profile) {
            return null;
        }

        return [
            'username' => $profile['display_name'] ?? null,
            'photo'    => $profile['avatar'] ?? null,
        ];
    }

    /**
     * Get GitHub stats from daily stats
     */
    private function getGithubStats(int $userId, string $filter = 'today'): ?array
    {
        $dateRange = $this->getDateRange($filter);

        if ($filter === 'today') {
            // Get today's stats only
            $dailyStats = DailyStat::with('metrics')
                ->byUser($userId)
                ->byProvider('github')
                ->byDate($dateRange['start'])
                ->first();

            if (!$dailyStats) {
                return null;
            }

            $stats = [
                'commits'       => 0,
                'repositories'  => 0,
                'contributions' => 0,
            ];

            foreach ($dailyStats->metrics as $metric) {
                switch ($metric->type) {
                    case 'commits':
                        $stats['commits'] = $metric->value;
                        break;
                    case 'repositories':
                        $stats['repositories'] = $metric->value;
                        break;
                    case 'contributions':
                        $stats['contributions'] = $metric->value;
                        break;
                }
            }

            return $stats;
        } else {
            // Get aggregated stats for weekly/monthly
            $dailyStats = DailyStat::with('metrics')
                ->byUser($userId)
                ->byProvider('github')
                ->byDateRange($dateRange['start'], $dateRange['end'])
                ->get();

            if ($dailyStats->isEmpty()) {
                return null;
            }

            // Sum up commits for the period
            $totalCommits = $dailyStats->flatMap->metrics
                ->where('type', 'commits')
                ->sum('value');

            // Get latest repositories and contributions counts
            $latestStats   = $dailyStats->sortByDesc('date')->first();
            $repositories  = 0;
            $contributions = 0;

            foreach ($latestStats->metrics as $metric) {
                switch ($metric->type) {
                    case 'repositories':
                        $repositories = $metric->value;
                        break;
                    case 'contributions':
                        $contributions = $metric->value;
                        break;
                }
            }

            return [
                'commits'       => $totalCommits,
                'repositories'  => $repositories,
                'contributions' => $contributions,
            ];
        }
    }

    /**
     * Get Fitbit profile data
     */
    private function getFitbitProfile(int $userId): ?array
    {
        $profile = $this->integrationAccountService->getFitbitProfile($userId);

        if (!$profile) {
            return null;
        }

        return [
            'username' => $profile['display_name'] ?? null,
            'photo'    => $profile['avatar'] ?? null,
        ];
    }

    /**
     * Get Fitbit stats from daily stats
     */
    private function getFitbitStats(int $userId, string $filter = 'today'): ?array
    {
        $dateRange = $this->getDateRange($filter);

        if ($filter === 'today') {
            // Get today's stats only
            $dailyStats = DailyStat::with('metrics')
                ->byUser($userId)
                ->byProvider('fitbit')
                ->byDate($dateRange['start'])
                ->with('metrics')
                ->first();

            if (!$dailyStats) {
                return null;
            }

            $stats = [
                'steps'    => 0,
                'calories' => 0,
                'distance' => 0,
            ];

            foreach ($dailyStats->metrics as $metric) {
                switch ($metric->type) {
                    case 'steps':
                        $stats['steps'] = $metric->value;
                        break;
                    case 'calories':
                        $stats['calories'] = $metric->value;
                        break;
                    case 'distance':
                        $stats['distance'] = $metric->value;
                        break;
                }
            }

            return $stats;
        } else {
            $dailyStats = DailyStat::with('metrics')
                ->byUser($userId)
                ->byProvider('fitbit')
                ->byDateRange($dateRange['start'], $dateRange['end'])
                ->get();

            if ($dailyStats->isEmpty()) {
                return null;
            }

            // Sum up all metrics for the period
            $totalSteps = $dailyStats->flatMap->metrics
                ->where('type', 'steps')
                ->sum('value');

            $totalCalories = $dailyStats->flatMap->metrics
                ->where('type', 'calories')
                ->sum('value');

            $totalDistance = $dailyStats->flatMap->metrics
                ->where('type', 'distance')
                ->sum('value');

            return [
                'steps'    => $totalSteps,
                'calories' => $totalCalories,
                'distance' => $totalDistance,
            ];
        }
    }

    /**
     * Get LeetCode profile data
     */
    private function getLeetcodeProfile(int $userId): ?array
    {
        $profile = $this->integrationAccountService->getLeetcodeProfile($userId);

        if (!$profile) {
            return null;
        }

        return [
            'username' => $profile['display_name'] ?? null,
            'photo'    => $profile['avatar'],
        ];
    }

    /**
     * Get Wakapi profile data
     */
    private function getWakapiProfile(int $userId): ?array
    {
        $profile = $this->integrationAccountService->getWakapiProfile($userId);
        if (!$profile) {
            return null;
        }

        return [
            'username' => $profile['display_name'] ?? null,
            'photo'    => $profile['avatar'],
        ];
    }

    /**
     * Get GitHub integration data
     */
    private function getGithubData(int $userId): array
    {
        $account = $this->integrationAccountService->getByUserAndIntegration($userId, IntegrationEnum::GITHUB);
        $profile = $this->integrationAccountService->getGithubProfile($userId);

        return [
            'isConnected' => $account !== null,
            'profile'     => $profile,
        ];
    }

    /**
     * Get Fitbit integration data
     */
    private function getFitbitData(int $userId): array
    {
        $account = $this->integrationAccountService->getByUserAndIntegration($userId, IntegrationEnum::FITBIT);
        $profile = $this->integrationAccountService->getFitbitProfile($userId);

        return [
            'isConnected' => $account !== null,
            'profile'     => $profile,
        ];
    }

    /**
     * Get LeetCode integration data
     */
    private function getLeetcodeData(int $userId, string $filter = 'today'): array
    {
        $isConnected = $this->integrationAccountService->getByUserAndIntegration($userId, IntegrationEnum::LEETCODE) !== null;
        $stats       = null;

        if ($isConnected) {
            $stats = $this->getLeetcodeStats($userId, $filter);
        }

        return [
            'isConnected' => $isConnected,
            'stats'       => $stats,
        ];
    }

    /**
     * Get Wakapi integration data
     */
    private function getWakapiData(int $userId, string $filter = 'today'): array
    {
        $isConnected = $this->integrationAccountService->getByUserAndIntegration($userId, IntegrationEnum::WAKAPI) !== null;
        $stats       = null;

        if ($isConnected) {
            $stats = $this->getWakapiStats($userId, $filter);
        }

        return [
            'isConnected' => $isConnected,
            'stats'       => $stats,
        ];
    }

    /**
     * Get LeetCode stats from daily stats
     */
    private function getLeetcodeStats(int $userId, string $filter = 'today'): ?array
    {
        $dateRange = $this->getDateRange($filter);

        if ($filter === 'today') {
            // Get today's stats only
            $dailyStats = DailyStat::with('metrics')
                ->byUser($userId)
                ->byProvider('leetcode')
                ->byDate($dateRange['start'])
                ->first();

            if (!$dailyStats) {
                return null;
            }

            $stats = [
                'problems_solved_easy'   => 0,
                'problems_solved_medium' => 0,
                'problems_solved_hard'   => 0,
                'problems_solved_total'  => 0,
                'ranking'                => 0,
                'last_updated'           => $dailyStats->date,
            ];

            foreach ($dailyStats->metrics as $metric) {
                switch ($metric->type) {
                    case 'problems_solved_easy_today':
                        $stats['problems_solved_easy'] = $metric->value;
                        break;
                    case 'problems_solved_medium_today':
                        $stats['problems_solved_medium'] = $metric->value;
                        break;
                    case 'problems_solved_hard_today':
                        $stats['problems_solved_hard'] = $metric->value;
                        break;
                    case 'problems_solved_today':
                        $stats['problems_solved_total'] = $metric->value;
                        break;
                    case 'ranking':
                        $stats['ranking'] = $metric->value;
                        break;
                }
            }

            return $stats;
        } else {
            // Get aggregated stats for weekly/monthly
            $dailyStats = DailyStat::with('metrics')
                ->byUser($userId)
                ->byProvider('leetcode')
                ->byDateRange($dateRange['start'], $dateRange['end'])
                ->get();

            if ($dailyStats->isEmpty()) {
                return null;
            }

            // Sum up problems solved by difficulty in the period
            $easyProblems = $dailyStats->flatMap->metrics
                ->where('type', 'problems_solved_easy_today')
                ->sum('value');

            $mediumProblems = $dailyStats->flatMap->metrics
                ->where('type', 'problems_solved_medium_today')
                ->sum('value');

            $hardProblems = $dailyStats->flatMap->metrics
                ->where('type', 'problems_solved_hard_today')
                ->sum('value');

            $totalProblems = $dailyStats->flatMap->metrics
                ->where('type', 'problems_solved_today')
                ->sum('value');

            // Get latest ranking from most recent record
            $latestStats   = $dailyStats->sortByDesc('date')->first();
            $latestRanking = 0;

            foreach ($latestStats->metrics as $metric) {
                if ($metric->type === 'ranking') {
                    $latestRanking = $metric->value;
                    break;
                }
            }

            return [
                'problems_solved_easy'   => $easyProblems,
                'problems_solved_medium' => $mediumProblems,
                'problems_solved_hard'   => $hardProblems,
                'problems_solved_total'  => $totalProblems,
                'ranking'                => $latestRanking,
                'last_updated'           => $latestStats->date,
            ];
        }
    }

    /**
     * Get Wakapi stats from daily stats
     */
    private function getWakapiStats(int $userId, string $filter = 'today'): ?array
    {
        $dateRange = $this->getDateRange($filter);

        if ($filter === 'today') {
            // Get today's stats only
            $dailyStats = DailyStat::with('metrics')
                ->byUser($userId)
                ->byProvider('wakapi')
                ->byDate($dateRange['start'])
                ->first();

            if (!$dailyStats) {
                return null;
            }

            $stats = [
                'coding_time'     => 0,
                'languages_count' => 0,
                'projects_count'  => 0,
                'last_updated'    => $dailyStats->date,
            ];

            foreach ($dailyStats->metrics as $metric) {
                switch ($metric->type) {
                    case 'coding_time':
                        $stats['coding_time'] = $metric->value;
                        break;
                    case 'languages_count':
                        $stats['languages_count'] = $metric->value;
                        break;
                    case 'projects_count':
                        $stats['projects_count'] = $metric->value;
                        break;
                }
            }

            return $stats;
        } else {
            // Get aggregated stats for weekly/monthly
            $dailyStats = DailyStat::with('metrics')
                ->byUser($userId)
                ->byProvider('wakapi')
                ->byDateRange($dateRange['start'], $dateRange['end'])
                ->get();

            if ($dailyStats->isEmpty()) {
                return null;
            }

            // Sum up coding time for the period
            $totalCodingTime = $dailyStats->flatMap->metrics
                ->where('type', 'coding_time')
                ->sum('value');

            // Get unique languages and projects counts
            $languagesCount = $dailyStats->flatMap->metrics
                ->where('type', 'languages_count')
                ->max('value') ?? 0;

            $projectsCount = $dailyStats->flatMap->metrics
                ->where('type', 'projects_count')
                ->max('value') ?? 0;

            $latestStats = $dailyStats->sortByDesc('date')->first();

            return [
                'coding_time'     => $totalCodingTime,
                'languages_count' => $languagesCount,
                'projects_count'  => $projectsCount,
                'last_updated'    => $latestStats->date,
            ];
        }
    }

    /**
     * Get date range based on filter
     */
    private function getDateRange(string $filter): array
    {
        switch ($filter) {
            case 'weekly':
                return [
                    'start' => Carbon::now()->startOfWeek()->toDateString(),
                    'end'   => Carbon::now()->endOfWeek()->toDateString(),
                ];
            case 'monthly':
                return [
                    'start' => Carbon::now()->startOfMonth()->toDateString(),
                    'end'   => Carbon::now()->endOfMonth()->toDateString(),
                ];
            case 'today':
            default:
                $today = Carbon::today()->toDateString();

                return [
                    'start' => $today,
                    'end'   => $today,
                ];
        }
    }
}
