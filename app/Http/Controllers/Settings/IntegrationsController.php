<?php

namespace App\Http\Controllers\Settings;

use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\DailyStat;
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
        $user = auth()->user();

        // Get all integration data
        $integrationData = [
            //            'github'   => $this->getGithubData($user->id),
            'fitbit'   => $this->getFitbitData($user->id),
            'leetcode' => $this->getLeetcodeData($user->id),
            'wakapi'   => $this->getWakapiData($user->id),
        ];

        return Inertia::render('settings/integrations', [
            'integrationData' => $integrationData,
        ]);
    }

    /**
     * Get GitHub integration data
     */
    private function getGithubData(int $userId): array
    {
        $account = $this->integrationAccountService->getByUserAndIntegration($userId, \App\Enums\IntegrationEnum::GITHUB);
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
        $account = $this->integrationAccountService->getByUserAndIntegration($userId, \App\Enums\IntegrationEnum::FITBIT);
        $profile = $this->integrationAccountService->getFitbitProfile($userId);

        return [
            'isConnected' => $account !== null,
            'profile'     => $profile,
        ];
    }

    /**
     * Get LeetCode integration data
     */
    private function getLeetcodeData(int $userId): array
    {
        $isConnected = $this->integrationAccountService->getByUserAndIntegration($userId, \App\Enums\IntegrationEnum::LEETCODE) !== null;
        $stats       = null;

        if ($isConnected) {
            $stats = $this->getLeetcodeStats($userId);
        }

        return [
            'isConnected' => $isConnected,
            'stats'       => $stats,
        ];
    }

    /**
     * Get Wakapi integration data
     */
    private function getWakapiData(int $userId): array
    {
        $isConnected = $this->integrationAccountService->getByUserAndIntegration($userId, \App\Enums\IntegrationEnum::WAKAPI) !== null;
        $stats       = null;

        if ($isConnected) {
            $stats = $this->getWakapiStats($userId);
        }

        return [
            'isConnected' => $isConnected,
            'stats'       => $stats,
        ];
    }

    /**
     * Get LeetCode stats from daily stats
     */
    private function getLeetcodeStats(int $userId): ?array
    {
        // Get today's stats
        $today = Carbon::today()->toDateString();

        $dailyStats = DailyStat::with('metrics')
            ->byUser($userId)
            ->byProvider('leetcode')
            ->byDate($today)
            ->first();

        if (!$dailyStats) {
            return null;
        }

        $stats = [
            'problems_solved_easy'   => 0,
            'problems_solved_medium' => 0,
            'problems_solved_hard'   => 0,
            'submissions_today'      => 0,
            'ranking'                => 0,
            'last_updated'           => $dailyStats->date,
        ];

        foreach ($dailyStats->metrics as $metric) {
            switch ($metric->type) {
                case 'problems_solved_easy':
                    $stats['problems_solved_easy'] = $metric->value;
                    break;
                case 'problems_solved_medium':
                    $stats['problems_solved_medium'] = $metric->value;
                    break;
                case 'problems_solved_hard':
                    $stats['problems_solved_hard'] = $metric->value;
                    break;
                case 'submissions_today':
                    $stats['submissions_today'] = $metric->value;
                    break;
                case 'ranking':
                    $stats['ranking'] = $metric->value;
                    break;
            }
        }

        return $stats;
    }

    /**
     * Get Wakapi stats from daily stats
     */
    private function getWakapiStats(int $userId): ?array
    {
        // Get today's stats
        $today = Carbon::today()->toDateString();

        $dailyStats = DailyStat::with('metrics')
            ->byUser($userId)
            ->byProvider('wakapi')
            ->byDate($today)
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
    }
}
