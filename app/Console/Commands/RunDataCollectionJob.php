<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Jobs\CollectUserIntegrationData;

class RunDataCollectionJob extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'integrations:run-collection {date?} {--sync : Run synchronously instead of queued}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run the integration data collection job for all users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $date = $this->argument('date') ?? now()->format('Y-m-d');
        $sync = $this->option('sync');
        
        $this->info("Starting integration data collection for date: {$date}");
        
        if ($sync) {
            $this->info('Running synchronously...');
            $job = new CollectUserIntegrationData($date);
            $job->handle();
            $this->info('Data collection completed!');
        } else {
            $this->info('Dispatching to queue...');
            CollectUserIntegrationData::dispatch($date);
            $this->info('Data collection job dispatched to queue!');
        }
        
        return Command::SUCCESS;
    }
}
