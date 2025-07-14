<?php

namespace App\Console\Commands\Github;

use Illuminate\Console\Command;
use App\Services\Integrations\Services\Integrations\Contracts\GithubServiceInterface;

class GetUserCommitsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'github:get-user-commits';

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
        //        app(GithubServiceInterface::class)->getActivitiesAndStore(8);
        app(GithubServiceInterface::class)->getUserRepos(8);
    }
}
