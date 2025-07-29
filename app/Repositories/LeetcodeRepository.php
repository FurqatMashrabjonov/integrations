<?php

namespace App\Repositories;

use App\Models\Leetcode;

class LeetcodeRepository implements Contracts\LeetcodeRepositoryInterface
{
    public function findByUserId(int $userId): ?Leetcode
    {
        return Leetcode::where('user_id', $userId)->first();
    }

    public function existsByUserId(int $userId): bool
    {
        return Leetcode::where('user_id', $userId)->exists();
    }

    public function updateOrCreateByUserId(int $userId, string $username): Leetcode
    {
        return Leetcode::updateOrCreate(
            ['user_id' => $userId],
            ['username' => $username]
        );
    }

    public function deleteByUserId(int $userId): void
    {
        Leetcode::where('user_id', $userId)->delete();
    }
}

