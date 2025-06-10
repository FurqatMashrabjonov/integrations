<?php

namespace App\Console\Commands\Fitbit;

use App\Models\User;
use App\Services\Integrations\Services\Integrations\Contracts\FitbitServiceInterface;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Number;

class GetUserStepsCommand extends Command
{
    public function __construct(
        private readonly FitbitServiceInterface $fitbitService,
    )
    {
        parent::__construct();
    }

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fitbit:get-user-steps';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $steps = $this->fitbitService->getUserSteps(2, Carbon::today()->format('Y-m-d'));
        $this->info(number_format($steps));
    }
}
