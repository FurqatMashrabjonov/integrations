<?php

namespace App\Repositories;

use App\Models\DailyStatMetric;
use App\Repositories\Contracts\DailyStatMetricRepositoryInterface;

class DailyStatMetricRepository implements DailyStatMetricRepositoryInterface
{
    public function deleteByDailyStatId(int $dailyStatId): bool
    {
        return $this->model->newQuery()
            ->where('daily_stat_id', $dailyStatId)
            ->delete() > 0;
    }

    public function findByDailyStatIdAndType(int $dailyStatId, string $type): ?DailyStatMetric
    {
        return $this->model->newQuery()
            ->where('daily_stat_id', $dailyStatId)
            ->where('type', $type)
            ->first();
    }

    public function updateOrCreate(array $conditions, array $data): DailyStatMetric
    {
        return $this->model->newQuery()->updateOrCreate($conditions, $data);
    }

    public function delete(int $id): bool
    {
        return $this->model->newQuery()->where('id', $id)->delete() > 0;
    }
}
