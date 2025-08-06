<?php

namespace App\Http\Controllers\Settings;

use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\DailyStat;
use App\Models\Integration;
use App\Http\Controllers\Controller;
use App\Services\IntegrationAccountService;

class IntegrationsController extends Controller
{
    public function __construct(
        private readonly IntegrationAccountService $integrationAccountService
    ) {}

    /**
     * Show the integrations settings page.
     */
    public function index(): Response
    {
        $user       = auth()->user();
        $dateFilter = request('date_filter', 'today'); // Default to 'today'

        // Get all integration data with date filter
        $integrationData = [
            'github'   => $this->getGithubData($user->id, $dateFilter),
            'fitbit'   => $this->getFitbitData($user->id, $dateFilter),
            'leetcode' => $this->getLeetcodeData($user->id, $dateFilter),
            'wakapi'   => $this->getWakapiData($user->id, $dateFilter),
        ];

        return Inertia::render('settings/integrations', [
            'integrationData' => $integrationData,
        ]);
    }

    /**
     * Get date range based on filter
     */
    private function getDateRange(string $dateFilter): array
    {
        $today = Carbon::today();

        return match ($dateFilter) {
            'today' => [
                'start' => $today->toDateString(),
                'end'   => $today->toDateString(),
            ],
            'weekly' => [
                'start' => $today->subDays(6)->toDateString(),
                'end'   => Carbon::today()->toDateString(),
            ],
            'monthly' => [
                'start' => $today->subDays(29)->toDateString(),
                'end'   => Carbon::today()->toDateString(),
            ],
            default => [
                'start' => $today->toDateString(),
                'end'   => $today->toDateString(),
            ],
        };
    }

    /**
     * Get GitHub integration data
     */
    private function getGithubData(int $userId, string $dateFilter = 'today'): array
    {
        $account = $this->integrationAccountService->getByUserAndIntegration($userId, \App\Enums\IntegrationEnum::GITHUB);
        $profile = $this->integrationAccountService->getGithubProfile($userId);
        $stats   = null;

        if ($account) {
            $stats = $this->getGithubStats($userId, $dateFilter);
        }

        return [
            'isConnected' => $account !== null,
            'profile'     => $profile,
            'stats'       => $stats,
        ];
    }

    /**
     * Get Fitbit integration data
     */
    private function getFitbitData(int $userId, string $dateFilter = 'today'): array
    {
        $account = $this->integrationAccountService->getByUserAndIntegration($userId, \App\Enums\IntegrationEnum::FITBIT);
        $profile = $this->integrationAccountService->getFitbitProfile($userId);
        $stats   = null;

        if ($account) {
            $stats = $this->getFitbitStats($userId, $dateFilter);
        }

        return [
            'isConnected' => $account !== null,
            'profile'     => $profile,
            'stats'       => $stats,
        ];
    }

    /**
     * Get LeetCode integration data
     */
    private function getLeetcodeData(int $userId, string $dateFilter = 'today'): array
    {
        $isConnected = $this->integrationAccountService->getByUserAndIntegration($userId, \App\Enums\IntegrationEnum::LEETCODE) !== null;
        $stats       = null;

        if ($isConnected) {
            $stats = $this->getLeetcodeStats($userId, $dateFilter);
        }

        return [
            'isConnected' => $isConnected,
            'stats'       => $stats,
        ];
    }

    /**
     * Get Wakapi integration data
     */
    private function getWakapiData(int $userId, string $dateFilter = 'today'): array
    {
        $isConnected = $this->integrationAccountService->getByUserAndIntegration($userId, \App\Enums\IntegrationEnum::WAKAPI) !== null;
        $stats       = null;

        if ($isConnected) {
            $stats = $this->getWakapiStats($userId, $dateFilter);
        }

        return [
            'isConnected' => $isConnected,
            'stats'       => $stats,
        ];
    }

    /**
     * Get LeetCode stats from daily stats
     */
    private function getLeetcodeStats(int $userId, string $dateFilter = 'today'): ?array
    {
        $dateRange = $this->getDateRange($dateFilter);

        $dailyStats = DailyStat::with('metrics')
            ->byUser($userId)
            ->byProvider('leetcode')
            ->whereBetween('date', [$dateRange['start'], $dateRange['end']])
            ->get();

        if ($dailyStats->isEmpty()) {
            return null;
        }

        $stats = [
            'problems_solved_easy'   => 0,
            'problems_solved_medium' => 0,
            'problems_solved_hard'   => 0,
            'total_submissions'      => 0,
            'avg_submissions'        => 0,
            'ranking'                => 0,
            'days_count'             => $dailyStats->count(),
            'date_filter'            => $dateFilter,
            'last_updated'           => $dailyStats->max('date'),
        ];

        // Aggregate metrics across all days
        foreach ($dailyStats as $dailyStat) {
            foreach ($dailyStat->metrics as $metric) {
                switch ($metric->type) {
                    case 'problems_solved_easy':
                    case 'problems_easy':
                        $stats['problems_solved_easy'] += $metric->value;
                        break;
                    case 'problems_solved_medium':
                    case 'problems_medium':
                        $stats['problems_solved_medium'] += $metric->value;
                        break;
                    case 'problems_solved_hard':
                    case 'problems_hard':
                        $stats['problems_solved_hard'] += $metric->value;
                        break;
                    case 'submissions_today':
                    case 'total_submissions':
                        $stats['total_submissions'] += $metric->value;
                        break;
                    case 'ranking':
                        $stats['ranking'] = $metric->value; // Take latest ranking
                        break;
                }
            }
        }

        // Calculate averages
        $stats['avg_submissions'] = $stats['days_count'] > 0 ? round($stats['total_submissions'] / $stats['days_count'], 1) : 0;

        return $stats;
    }

    /**
     * Get GitHub stats from daily stats
     */
    private function getGithubStats(int $userId, string $dateFilter = 'today'): ?array
    {
        $dateRange = $this->getDateRange($dateFilter);

        $dailyStats = DailyStat::with('metrics')
            ->byUser($userId)
            ->byProvider('github')
            ->whereBetween('date', [$dateRange['start'], $dateRange['end']])
            ->get();

        if ($dailyStats->isEmpty()) {
            return null;
        }

        $stats = [
            'total_commits' => 0,
            'total_prs'     => 0,
            'total_repos'   => 0,
            'avg_commits'   => 0,
            'avg_prs'       => 0,
            'days_count'    => $dailyStats->count(),
            'date_filter'   => $dateFilter,
            'last_updated'  => $dailyStats->max('date'),
        ];

        // Aggregate metrics across all days
        foreach ($dailyStats as $dailyStat) {
            foreach ($dailyStat->metrics as $metric) {
                switch ($metric->type) {
                    case 'commits':
                    case 'commit_count':
                        $stats['total_commits'] += $metric->value;
                        break;
                    case 'pr_count':
                        $stats['total_prs'] += $metric->value;
                        break;
                    case 'repositories':
                        $stats['total_repos'] = max($stats['total_repos'], $metric->value); // Take max, not sum
                        break;
                }
            }
        }

        // Calculate averages
        $stats['avg_commits'] = $stats['days_count'] > 0 ? round($stats['total_commits'] / $stats['days_count'], 1) : 0;
        $stats['avg_prs']     = $stats['days_count'] > 0 ? round($stats['total_prs'] / $stats['days_count'], 1) : 0;

        return $stats;
    }

    /**
     * Get Fitbit stats from daily stats
     */
    private function getFitbitStats(int $userId, string $dateFilter = 'today'): ?array
    {
        $dateRange = $this->getDateRange($dateFilter);

        $dailyStats = DailyStat::with('metrics')
            ->byUser($userId)
            ->byProvider('fitbit')
            ->whereBetween('date', [$dateRange['start'], $dateRange['end']])
            ->get();

        if ($dailyStats->isEmpty()) {
            return null;
        }

        $stats = [
            'today_steps'    => 0,
            'today_distance' => 0,
            'week_steps'     => 0,
            'calories'       => 0,
            'total_steps'    => 0,
            'avg_steps'      => 0,
            'total_distance' => 0,
            'total_calories' => 0,
            'days_count'     => $dailyStats->count(),
            'date_filter'    => $dateFilter,
            'last_updated'   => $dailyStats->max('date'),
        ];

        // Aggregate metrics across all days
        foreach ($dailyStats as $dailyStat) {
            foreach ($dailyStat->metrics as $metric) {
                switch ($metric->type) {
                    case 'steps':
                        $stats['total_steps'] += $metric->value;
                        break;
                    case 'distance':
                        $stats['total_distance'] += $metric->value; // In meters
                        break;
                    case 'calories':
                        $stats['total_calories'] += $metric->value;
                        break;
                }
            }
        }

        // Calculate averages and conversions
        $stats['avg_steps']      = $stats['days_count'] > 0 ? round($stats['total_steps'] / $stats['days_count']) : 0;
        $stats['today_steps']    = $dateFilter === 'today' ? $stats['total_steps'] : $stats['avg_steps'];
        $stats['today_distance'] = round($stats['total_distance'] / 1000, 1); // Convert to km
        $stats['week_steps']     = $stats['total_steps']; // For compatibility
        $stats['calories']       = $stats['total_calories'];

        return $stats;
    }

    /**
     * Get Wakapi stats from daily stats
     */
    private function getWakapiStats(int $userId, string $dateFilter = 'today'): ?array
    {
        $dateRange = $this->getDateRange($dateFilter);

        $dailyStats = DailyStat::with('metrics')
            ->byUser($userId)
            ->byProvider('wakapi')
            ->whereBetween('date', [$dateRange['start'], $dateRange['end']])
            ->get();

        if ($dailyStats->isEmpty()) {
            return null;
        }

        $stats = [
            'total_coding_time' => 0,
            'avg_coding_time'   => 0,
            'total_languages'   => 0,
            'total_projects'    => 0,
            'coding_time'       => 0, // For compatibility
            'languages_count'   => 0, // For compatibility
            'projects_count'    => 0, // For compatibility
            'days_count'        => $dailyStats->count(),
            'date_filter'       => $dateFilter,
            'last_updated'      => $dailyStats->max('date'),
        ];

        // Aggregate metrics across all days
        foreach ($dailyStats as $dailyStat) {
            foreach ($dailyStat->metrics as $metric) {
                switch ($metric->type) {
                    case 'coding_time':
                        $stats['total_coding_time'] += $metric->value;
                        break;
                    case 'languages_count':
                        $stats['total_languages'] = max($stats['total_languages'], $metric->value);
                        break;
                    case 'projects_count':
                        $stats['total_projects'] = max($stats['total_projects'], $metric->value);
                        break;
                }
            }
        }

        // Calculate averages and compatibility values
        $stats['avg_coding_time'] = $stats['days_count'] > 0 ? round($stats['total_coding_time'] / $stats['days_count']) : 0;
        $stats['coding_time']     = $dateFilter === 'today' ? $stats['total_coding_time'] : $stats['avg_coding_time'];
        $stats['languages_count'] = $stats['total_languages'];
        $stats['projects_count']  = $stats['total_projects'];

        return $stats;
    }
}
