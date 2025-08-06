<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\DailyStat;
use App\Enums\IntegrationEnum;
use App\Models\DailyStatMetric;
use App\Models\IntegrationToken;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Services\Integrations\FitbitService;
use App\Services\Integrations\GithubService;
use App\Services\Integrations\WakapiService;
use App\Services\Integrations\LeetcodeService;

class CollectUserIntegrationData implements ShouldQueue
{
    use Queueable;

    protected $date;

    /**
     * Create a new job instance.
     */
    public function __construct(?string $date = null)
    {
        $this->date = $date ?? now()->format('Y-m-d');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info("Starting integration data collection for date: {$this->date}");

        $users = User::whereHas('integrationTokens')->with('integrationTokens')->get();

        Log::info("Found {$users->count()} users with integrations");

        $successCount = 0;
        $errorCount   = 0;

        foreach ($users as $user) {
            foreach ($user->integrationTokens as $token) {
                try {
                    $this->collectDataForIntegration($user, $token);
                    $successCount++;
                } catch (\Exception $e) {
                    $errorCount++;
                    Log::error("Failed to collect data for user {$user->id}, integration {$token->integration->value}: " . $e->getMessage());
                }
            }
        }

        Log::info("Data collection completed: {$successCount} successful, {$errorCount} errors");
    }

    protected function collectDataForIntegration(User $user, IntegrationToken $token): void
    {
        try {
            // Use a more defensive approach to handle existing records
            // Ensure date format matches database storage format
            $dateForComparison = \Carbon\Carbon::parse($this->date)->format('Y-m-d');

            $dailyStat = DailyStat::where([
                'user_id'  => $user->id,
                'provider' => $token->integration->value,
            ])->whereDate('date', $dateForComparison)->first();

            if (!$dailyStat) {
                $dailyStat = DailyStat::create([
                    'user_id'  => $user->id,
                    'date'     => $this->date,
                    'provider' => $token->integration->value,
                ]);
            }
        } catch (\Exception $e) {
            // If creation fails due to unique constraint, try to find existing record
            $dateForComparison = \Carbon\Carbon::parse($this->date)->format('Y-m-d');

            $dailyStat = DailyStat::where([
                'user_id'  => $user->id,
                'provider' => $token->integration->value,
            ])->whereDate('date', $dateForComparison)->first();

            if (!$dailyStat) {
                throw $e; // Re-throw if we still can't find the record
            }
        }

        match ($token->integration) {
            IntegrationEnum::GITHUB   => $this->collectGithubData($user, $dailyStat),
            IntegrationEnum::FITBIT   => $this->collectFitbitData($user, $dailyStat),
            IntegrationEnum::WAKAPI   => $this->collectWakapiData($user, $dailyStat),
            IntegrationEnum::LEETCODE => $this->collectLeetcodeData($user, $dailyStat),
        };
    }

    protected function collectGithubData(User $user, DailyStat $dailyStat): void
    {
        try {
            $service = app(GithubService::class);

            // Collect commits, repos, and contributions for today
            $commits       = $this->getGithubCommitsForDate($user, $this->date);
            $repos         = $this->getGithubReposCount($user);
            $contributions = $this->getGithubContributionsForDate($user, $this->date);

            $this->storeMetric($dailyStat, 'commits', $commits, 'count');
            $this->storeMetric($dailyStat, 'repositories', $repos, 'count');
            $this->storeMetric($dailyStat, 'contributions', $contributions, 'count');

            Log::info("GitHub data collected for user {$user->id}: commits={$commits}, repos={$repos}, contributions={$contributions}");
        } catch (\Exception $e) {
            Log::error("Failed to collect GitHub data for user {$user->id}: " . $e->getMessage());
        }
    }

    protected function collectFitbitData(User $user, DailyStat $dailyStat): void
    {
        try {
            $service = app(FitbitService::class);

            // Get steps for the specific date
            $steps = $service->getUserStepsAndStore($user->id, $this->date);

            // Get additional metrics like distance and calories if available
            $data = $this->getFitbitDetailedData($user, $this->date);

            $this->storeMetric($dailyStat, 'steps', $steps, 'count');

            if (isset($data['distance'])) {
                $this->storeMetric($dailyStat, 'distance', $data['distance'], 'meters');
            }

            if (isset($data['calories'])) {
                $this->storeMetric($dailyStat, 'calories', $data['calories'], 'kcal');
            }

            Log::info("Fitbit data collected for user {$user->id}: steps={$steps}");
        } catch (\Exception $e) {
            Log::error("Failed to collect Fitbit data for user {$user->id}: " . $e->getMessage());
        }
    }

    protected function collectWakapiData(User $user, DailyStat $dailyStat): void
    {
        try {
            $service = app(WakapiService::class);

            // Get coding time and language stats for the date
            $data = $this->getWakapiDataForDate($user, $this->date);

            if (isset($data['coding_time'])) {
                $this->storeMetric($dailyStat, 'coding_time', $data['coding_time'], 'seconds');
            }

            if (isset($data['languages_count'])) {
                $this->storeMetric($dailyStat, 'languages_count', $data['languages_count'], 'count');
            }

            if (isset($data['projects_count'])) {
                $this->storeMetric($dailyStat, 'projects_count', $data['projects_count'], 'count');
            }

            Log::info("Wakapi data collected for user {$user->id}");
        } catch (\Exception $e) {
            Log::error("Failed to collect Wakapi data for user {$user->id}: " . $e->getMessage());
        }
    }

    protected function collectLeetcodeData(User $user, DailyStat $dailyStat): void
    {
        try {
            $service = app(LeetcodeService::class);

            // Get LeetCode stats
            $data = $this->getLeetcodeDataForUser($user);

            if (isset($data['problems_solved_easy'])) {
                $this->storeMetric($dailyStat, 'problems_solved_easy', $data['problems_solved_easy'], 'count');
            }

            if (isset($data['problems_solved_medium'])) {
                $this->storeMetric($dailyStat, 'problems_solved_medium', $data['problems_solved_medium'], 'count');
            }

            if (isset($data['problems_solved_hard'])) {
                $this->storeMetric($dailyStat, 'problems_solved_hard', $data['problems_solved_hard'], 'count');
            }

            if (isset($data['submissions_today'])) {
                $this->storeMetric($dailyStat, 'submissions_today', $data['submissions_today'], 'count');
            }

            if (isset($data['ranking'])) {
                $this->storeMetric($dailyStat, 'ranking', $data['ranking'], 'position');
            }

            Log::info("LeetCode data collected for user {$user->id}");
        } catch (\Exception $e) {
            Log::error("Failed to collect LeetCode data for user {$user->id}: " . $e->getMessage());
        }
    }

    protected function storeMetric(DailyStat $dailyStat, string $type, $value, ?string $unit = null): void
    {
        DailyStatMetric::updateOrCreate([
            'daily_stat_id' => $dailyStat->id,
            'type'          => $type,
        ], [
            'value' => $value,
            'unit'  => $unit,
            'meta'  => null,
        ]);
    }

    // Helper methods to fetch data from each service
    protected function getGithubCommitsForDate(User $user, string $date): int
    {
        try {
            // Get GitHub integration account for the user
            $integrationAccount = $user->integrationAccounts->where('integration', IntegrationEnum::GITHUB)->first();

            if (!$integrationAccount) {
                return 0;
            }

            // Use GitHub API to get commits for the specific date
            // This would require implementing GitHub API calls to get commit count for the date
            return 0; // Placeholder - implement actual GitHub API call
        } catch (\Exception $e) {
            Log::error("Failed to get GitHub commits for user {$user->id}: " . $e->getMessage());

            return 0;
        }
    }

    protected function getGithubReposCount(User $user): int
    {
        try {
            $integrationAccount = $user->integrationAccounts->where('integration', IntegrationEnum::GITHUB)->first();

            if (!$integrationAccount) {
                return 0;
            }

            // Use existing GitHub service to get repository count
            return 0; // Placeholder - implement actual GitHub API call
        } catch (\Exception $e) {
            Log::error("Failed to get GitHub repos count for user {$user->id}: " . $e->getMessage());

            return 0;
        }
    }

    protected function getGithubContributionsForDate(User $user, string $date): int
    {
        try {
            $integrationAccount = $user->integrationAccounts->where('integration', IntegrationEnum::GITHUB)->first();

            if (!$integrationAccount) {
                return 0;
            }

            // Use GitHub API to get contributions for the specific date
            return 0; // Placeholder - implement actual GitHub API call
        } catch (\Exception $e) {
            Log::error("Failed to get GitHub contributions for user {$user->id}: " . $e->getMessage());

            return 0;
        }
    }

    protected function getFitbitDetailedData(User $user, string $date): array
    {
        try {
            $service          = app(FitbitService::class);
            $integrationToken = $user->integrationTokens->where('integration', IntegrationEnum::FITBIT)->first();

            if (!$integrationToken) {
                return [];
            }

            // Use the existing Fitbit service to get detailed activity data
            // This would require implementing the GetUserActivitiesRequest
            return [
                'distance' => 0, // meters - implement actual API call
                'calories' => 0, // kcal - implement actual API call
            ];
        } catch (\Exception $e) {
            Log::error("Failed to get Fitbit detailed data for user {$user->id}: " . $e->getMessage());

            return [];
        }
    }

    protected function getWakapiDataForDate(User $user, string $date): array
    {
        try {
            // Get Wakapi data for the specific date
            // This would require implementing Wakapi API calls to get daily stats
            return [
                'coding_time'     => 0, // seconds
                'languages_count' => 0,
                'projects_count'  => 0,
            ];
        } catch (\Exception $e) {
            Log::error("Failed to get Wakapi data for user {$user->id}: " . $e->getMessage());

            return [];
        }
    }

    protected function getLeetcodeDataForUser(User $user): array
    {
        try {
            // Get LeetCode user stats
            // This would use the existing LeetCode service
            return [
                'problems_solved_easy'   => 0,
                'problems_solved_medium' => 0,
                'problems_solved_hard'   => 0,
                'submissions_today'      => 0,
                'ranking'                => 0,
            ];
        } catch (\Exception $e) {
            Log::error("Failed to get LeetCode data for user {$user->id}: " . $e->getMessage());

            return [];
        }
    }
}
