<?php

namespace App\Repositories;

use App\Dtos\FitbitAccountDTO;
use App\Models\FitbitAccount;
use App\Repositories\Contracts\FitbitAccountRepositoryInterface;

class FitbitAccountRepository implements FitbitAccountRepositoryInterface
{
    public function __construct(protected FitbitAccount $model)
    {
    }

    public function findByUserId(int $userId)
    {
        return $this->model->newQuery()->where('user_id', $userId)->first();
    }

    public function storeOrUpdate(FitbitAccountDTO $dto): void
    {
        $this->model->newQuery()->updateOrCreate([
            'user_id' => $dto->user_id,
        ], [
            'display_name' => $dto->display_name,
            'full_name' => $dto->full_name,
            'avatar' => $dto->avatar,
        ]);
    }

    public function delete(int $userId): void
    {
        $this->model->newQuery()->where('user_id', $userId)->delete();
    }
}
