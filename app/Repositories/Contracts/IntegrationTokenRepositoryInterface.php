<?php

namespace App\Repositories\Contracts;

use App\Enums\IntegrationEnum;
use App\Dtos\IntegrationTokenDTO;

interface IntegrationTokenRepositoryInterface
{
    public function findByUserIdAndType(int $userId, IntegrationEnum $type);

    public function storeOrUpdate(IntegrationTokenDTO $dto): void;

    public function delete(int $userId, string $type): void;
}
