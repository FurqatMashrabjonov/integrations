<?php

namespace App\Repositories;

use App\Models\UserFitbitStep;
use App\Dtos\UserFitbitStepDTO;
use App\Repositories\Contracts\UserFitbitStepRepositoryInterface;

class UserFitbitStepRepository implements UserFitbitStepRepositoryInterface
{
    public function __construct(protected UserFitbitStep $model) {}

    public function storeOrUpdate(UserFitbitStepDTO $dto): void
    {
        $this->model->newQuery()
            ->updateOrCreate(
                [
                    'user_id' => $dto->user_id,
                    'date'    => $dto->date,
                ],
                [
                    'steps' => $dto->steps,
                ]
            );
    }

    public function delete(int $userId, ?string $date = null): void
    {
        $this->model->newQuery()->where('user_id', $userId)
            ->where('date', $date)
            ->delete();
    }

    public function findByUserId(int $userId)
    {
        return $this->model->newQuery()->where('user_id', $userId)->first();
    }
}
