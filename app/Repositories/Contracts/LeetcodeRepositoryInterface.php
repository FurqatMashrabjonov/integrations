<?php

namespace App\Repositories\Contracts;

use App\Models\Leetcode;

interface LeetcodeRepositoryInterface
{
    public function findByUserId(int $userId): ?Leetcode;

    public function existsByUserId(int $userId): bool;

    public function updateOrCreateByUserId(int $userId, string $username): Leetcode;

    public function deleteByUserId(int $userId): void;
}
