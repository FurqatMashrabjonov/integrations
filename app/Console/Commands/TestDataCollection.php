<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\DailyStat;
use App\Models\IntegrationAccount;
use Illuminate\Console\Command;
use Carbon\Carbon;

class TestDataCollection extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:data-collection';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test data collection to debug issues';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== DEBUGGING DATA COLLECTION ISSUE ===');

        // Check users
        $userCount = User::count();
        $this->info("Total users: {$userCount}");

        // Check integration accounts
        $accountCount = IntegrationAccount::count();
        $this->info("Total integration accounts: {$accountCount}");

        if ($accountCount > 0) {
            $accounts = IntegrationAccount::with('user')->get();
            foreach($accounts as $account) {
                $this->info("User {$account->user->name} has {$account->integration->value} account");
                $this->info("  Data: " . json_encode($account->data));
            }
        }

        // Check daily stats
        $statsCount = DailyStat::count();
        $this->info("Total daily stats: {$statsCount}");

        if ($statsCount > 0) {
            $stats = DailyStat::with('metrics')->latest()->take(5)->get();
            foreach($stats as $stat) {
                $this->info("Stat: User {$stat->user_id}, {$stat->provider}, {$stat->date} - {$stat->metrics->count()} metrics");
                foreach($stat->metrics as $metric) {
                    $this->info("  - {$metric->type}: {$metric->value} {$metric->unit}");
                }
            }
        } else {
            $this->warn('No daily stats found! This is why cards show no data.');
        }

        // Test creating some sample data if no accounts exist
        if ($accountCount === 0 && $userCount > 0) {
            $this->warn('No integration accounts found. Creating sample data for testing...');
            $user = User::first();
            
            // Create sample Wakapi account
            IntegrationAccount::create([
                'user_id' => $user->id,
                'integration' => \App\Enums\IntegrationEnum::WAKAPI,
                'display_name' => 'test_user',
                'data' => ['username' => 'test_user']
            ]);
            
            // Create sample LeetCode account
            IntegrationAccount::create([
                'user_id' => $user->id,
                'integration' => \App\Enums\IntegrationEnum::LEETCODE,
                'display_name' => 'test_user',
                'data' => ['username' => 'test_user']
            ]);
            
            $this->info('Sample integration accounts created!');
        }

        return Command::SUCCESS;
    }
}
