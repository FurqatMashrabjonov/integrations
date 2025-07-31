<?php

namespace App\Repositories;

use App\Models\DailyStat;
use Illuminate\Support\Collection;
use App\Repositories\Contracts\DailyStatRepositoryInterface;

class DailyStatRepository implements DailyStatRepositoryInterface
{
    public function findByUserAndProviderAndDate(int $userId, string $provider, string $date): ?DailyStat
    {
        // TODO: Implement findByUserAndProviderAndDate() method.
    }

    public function findByUserAndProvider(int $userId, string $provider): Collection
    {
        // TODO: Implement findByUserAndProvider() method.
    }

    public function findByUserProviderAndDateRange(int $userId, string $provider, string $startDate, string $endDate): Collection
    {
        // TODO: Implement findByUserProviderAndDateRange() method.
    }

    public function updateOrCreate(array $conditions, array $data): DailyStat
    {
        // TODO: Implement updateOrCreate() method.
    }

    public function delete(int $id): bool
    {
        return $this->model->newQuery()->where('id', $id)->delete() > 0;
    }

    public function deleteByUserAndProvider(int $userId, string $provider): bool
    {
        return $this->model->newQuery()
            ->where('user_id', $userId)
            ->where('provider', $provider)
            ->delete() > 0;
    }
}
