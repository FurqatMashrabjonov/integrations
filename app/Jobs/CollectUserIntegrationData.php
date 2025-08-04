<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\DailyStat;
use App\Enums\IntegrationEnum;
use App\Models\DailyStatMetric;
use App\Models\IntegrationAccount;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Services\Integrations\FitbitService;
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

        $users = User::whereHas('integrationAccounts')->with('integrationAccounts')->get();

        Log::info("Found {$users->count()} users with integrations");

        $successCount = 0;
        $errorCount   = 0;

        foreach ($users as $user) {
            foreach ($user->integrationAccounts as $account) {
                try {
                    $this->collectDataForIntegration($user, $account);
                    $successCount++;
                } catch (\Exception $e) {
                    $errorCount++;
                    Log::error("Failed to collect data for user {$user->id}, integration {$account->integration->value}: " . $e->getMessage());
                }
            }
        }

        Log::info("Data collection completed: {$successCount} successful, {$errorCount} errors");
    }

    protected function collectDataForIntegration(User $user, IntegrationAccount $account): void
    {
        try {
            // Use a more defensive approach to handle existing records
            // Ensure date format matches database storage format
            $dateForComparison = \Carbon\Carbon::parse($this->date)->format('Y-m-d');

            $dailyStat = DailyStat::where([
                'user_id'  => $user->id,
                'provider' => $account->integration->value,
            ])->whereDate('date', $dateForComparison)->first();

            if (!$dailyStat) {
                $dailyStat = DailyStat::create([
                    'user_id'  => $user->id,
                    'date'     => $this->date,
                    'provider' => $account->integration->value,
                ]);
            }
        } catch (\Exception $e) {
            // If creation fails due to unique constraint, try to find existing record
            $dateForComparison = \Carbon\Carbon::parse($this->date)->format('Y-m-d');

            $dailyStat = DailyStat::where([
                'user_id'  => $user->id,
                'provider' => $account->integration->value,
            ])->whereDate('date', $dateForComparison)->first();

            if (!$dailyStat) {
                throw $e; // Re-throw if we still can't find the record
            }
        }

        match ($account->integration) {
            IntegrationEnum::GITHUB   => $this->collectGithubData($user, $dailyStat),
            IntegrationEnum::FITBIT   => $this->collectFitbitData($user, $dailyStat),
            IntegrationEnum::WAKAPI   => $this->collectWakapiData($user, $dailyStat),
            IntegrationEnum::LEETCODE => $this->collectLeetcodeData($user, $dailyStat),
        };
    }

    protected function collectGithubData(User $user, DailyStat $dailyStat): void
    {
        try {
            // Get GitHub integration account for the user
            $integrationAccount = $user->integrationAccounts->where('integration', IntegrationEnum::GITHUB)->first();

            if (!$integrationAccount) {
                Log::warning("No GitHub account found for user {$user->id}");

                return;
            }

            // For now, store placeholder values until GitHub service implementation is complete
            $this->storeMetric($dailyStat, 'commits', 0, 'count');
            $this->storeMetric($dailyStat, 'repositories', 0, 'count');
            $this->storeMetric($dailyStat, 'contributions', 0, 'count');

            Log::info("GitHub data collected for user {$user->id} (placeholder values)");
        } catch (\Exception $e) {
            Log::error("Failed to collect GitHub data for user {$user->id}: " . $e->getMessage());
        }
    }

    protected function collectFitbitData(User $user, DailyStat $dailyStat): void
    {
        try {
            $service = app(FitbitService::class);

            // Get steps for the specific date using the existing service
            $steps = $service->getUserStepsAndStore($user->id, $this->date);

            $this->storeMetric($dailyStat, 'steps', $steps, 'count');

            Log::info("Fitbit data collected for user {$user->id}: steps={$steps}");
        } catch (\Exception $e) {
            Log::error("Failed to collect Fitbit data for user {$user->id}: " . $e->getMessage());
        }
    }

    protected function collectWakapiData(User $user, DailyStat $dailyStat): void
    {
        try {
            $service = app(WakapiService::class);

            // Get Wakapi integration account for the user
            $integrationAccount = $user->integrationAccounts->where('integration', IntegrationEnum::WAKAPI)->first();

            if (!$integrationAccount) {
                Log::warning("No Wakapi account found for user {$user->id}");
                return;
            }

            // Get username and API token from the data JSON field
            $username = $integrationAccount->data['username'] ?? null;
            $apiToken = $integrationAccount->data['api_token'] ?? null;
            
            if (!$username) {
                Log::warning("No Wakapi username found for user {$user->id}");
                return;
            }
            
            if (!$apiToken) {
                Log::warning("No Wakapi API token found for user {$user->id}");
                return;
            }

            // Set token and get daily activities using the Wakapi service
            $service->setToken($apiToken);
            $dailyActivity = $service->getDailyActivities('today');

            $codingTime = $dailyActivity->data['cumulative_total']['total_seconds'] ?? 0;
            $languagesCount = count($dailyActivity->languages);
            $projectsCount = count($dailyActivity->projects);

            $this->storeMetric($dailyStat, 'coding_time', $codingTime, 'seconds');
            $this->storeMetric($dailyStat, 'languages_count', $languagesCount, 'count');
            $this->storeMetric($dailyStat, 'projects_count', $projectsCount, 'count');

            Log::info("Wakapi data collected for user {$user->id}: {$codingTime} seconds, {$languagesCount} languages, {$projectsCount} projects");
        } catch (\Exception $e) {
            Log::error("Failed to collect Wakapi data for user {$user->id}: " . $e->getMessage());
        }
    }

    protected function collectLeetcodeData(User $user, DailyStat $dailyStat): void
    {
        try {
            $service = app(LeetcodeService::class);

            // Get LeetCode integration account for the user
            $integrationAccount = $user->integrationAccounts->where('integration', IntegrationEnum::LEETCODE)->first();

            if (!$integrationAccount) {
                Log::warning("No LeetCode account found for user {$user->id}");
                return;
            }

            // Get username from the data JSON field
            $username = $integrationAccount->data['username'] ?? null;
            
            if (!$username) {
                Log::warning("No LeetCode username found for user {$user->id}");
                return;
            }

            // Use the LeetCode service to store daily stats with the username
            $dailyStatResult = $service->storeDailyStats($user->id, $this->date);

            Log::info("LeetCode data collected for user {$user->id}, stored " . $dailyStatResult->metrics->count() . ' metrics');
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
}
