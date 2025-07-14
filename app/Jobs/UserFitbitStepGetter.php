<?php

namespace App\Jobs;

use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Services\Integrations\Services\Integrations\Contracts\FitbitServiceInterface;

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
