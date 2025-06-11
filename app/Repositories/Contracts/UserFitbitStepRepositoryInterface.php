<?php

namespace App\Repositories\Contracts;

use App\Dtos\BaseDto;
use App\Dtos\FitbitAccountDTO;
use App\Dtos\UserFitbitStepDTO;

interface UserFitbitStepRepositoryInterface
{
    public function findByUserId(int $userId);

    public function storeOrUpdate(UserFitbitStepDTO $dto): void;

    public function delete(int $userId, ?string $date = null): void;
}
