<?php

namespace App\Jobs;

use App\Services\Integrations\Services\Integrations\Contracts\FitbitServiceInterface;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class UserFitbitStepGetter implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public int $userId, public ?string $date = null)
    {
        if (!$this->date) {
            $this->date = now()->format('Y-m-d');
        }
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        app(FitbitServiceInterface::class)->getUserStepsAndStore($this->userId, $this->date);
    }
}
