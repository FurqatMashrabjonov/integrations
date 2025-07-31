<?php

namespace App\Repositories\Contracts;

use App\Models\DailyStat;
use Illuminate\Support\Collection;

interface DailyStatRepositoryInterface
{
    public function findByUserAndProviderAndDate(int $userId, string $provider, string $date): ?DailyStat;

    public function findByUserAndProvider(int $userId, string $provider): Collection;

    public function findByUserProviderAndDateRange(int $userId, string $provider, string $startDate, string $endDate): Collection;

    public function updateOrCreate(array $conditions, array $data): DailyStat;

    public function delete(int $id): bool;

    public function deleteByUserAndProvider(int $userId, string $provider): bool;
}
