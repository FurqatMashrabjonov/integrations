<?php

namespace App\Repositories\Contracts;

use App\Dtos\FitbitAccountDTO;

interface FitbitAccountRepositoryInterface
{
    public function findByUserId(int $userId);

    public function storeOrUpdate(FitbitAccountDTO $dto): void;

    public function delete(int $userId): void;
}
