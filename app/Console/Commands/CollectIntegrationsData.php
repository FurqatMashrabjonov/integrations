<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Jobs\CollectUserIntegrationData;

class CollectIntegrationsData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'integrations:collect {date?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Collect integration data from all providers for all users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $date = $this->argument('date') ?? now()->format('Y-m-d');

        $this->info("Collecting integration data for date: {$date}");

        // Dispatch the job
        CollectUserIntegrationData::dispatch($date);

        $this->info('Data collection job dispatched successfully!');

        return Command::SUCCESS;
    }
}
