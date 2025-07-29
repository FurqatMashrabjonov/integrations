<?php

namespace App\Console\Commands;

use App\Models\Leetcode;
use Illuminate\Support\Carbon;
use App\Models\LeetcodeProfile;
use Illuminate\Console\Command;
use App\Services\Integrations\Services\Integrations\Contracts\LeetcodeServiceInterface;

class SyncLeetcodeProfiles extends Command
{
    protected $signature   = 'leetcode:sync-profiles';
    protected $description = 'Sync Leetcode profiles and recent activity for all connected users';

    public function handle(LeetcodeServiceInterface $service)
    {
        $this->info('Syncing Leetcode profiles...');
        $count = 0;
        foreach (Leetcode::all() as $leetcode) {
            try {
                $profile = $service->getUser($leetcode->username);
                $recent  = $service->getUserRecentSubmissions($leetcode->username);
                LeetcodeProfile::updateOrCreate(
                    ['leetcode_id' => $leetcode->id],
                    [
                        'username'       => $leetcode->username,
                        'profile'        => $profile,
                        'recent'         => $recent,
                        'last_synced_at' => Carbon::now(),
                    ]
                );
                $count++;
            } catch (\Throwable $e) {
                $this->error('Failed for ' . $leetcode->username . ': ' . $e->getMessage());
            }
        }
        $this->info("Synced $count profiles.");

        return 0;
    }
}
