<?php

namespace App\Console\Commands\Fitbit;

use App\Enums\IntegrationEnum;
use App\Jobs\UserFitbitStepGetter;
use App\Models\User;
use App\Services\Integrations\Services\Integrations\Contracts\FitbitServiceInterface;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Number;

class GetUserStepsCommand extends Command
{
    public function __construct()
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
        $users = User::query()->whereHas('integrationTokens', function ($query) {
            $query->where('integration', '=', IntegrationEnum::FITBIT);
        })->get();

        foreach ($users as $user) {
            try {
                UserFitbitStepGetter::dispatch($user->id, Carbon::now()->format('Y-m-d'));
            } catch (\Exception $e) {
                $this->error("Failed to fetch steps for user: {$user->name}. Error: {$e->getMessage()}");
            }
        }
    }
}
