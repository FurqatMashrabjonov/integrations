<?php

namespace App\Repositories\Contracts;

use App\Models\DailyStatMetric;
use Illuminate\Support\Collection;

interface DailyStatMetricRepositoryInterface
{
    public function findByDailyStatIdAndType(int $dailyStatId, string $type): ?DailyStatMetric;

    public function updateOrCreate(array $conditions, array $data): DailyStatMetric;

    public function delete(int $id): bool;

    public function deleteByDailyStatId(int $dailyStatId): bool;
}
