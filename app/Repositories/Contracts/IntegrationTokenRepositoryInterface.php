<?php

namespace App\Repositories\Contracts;

use App\Dtos\IntegrationTokenDTO;
use App\Enums\IntegrationEnum;

interface IntegrationTokenRepositoryInterface
{
    public function findByUserIdAndType(int $userId, IntegrationEnum $type);

    public function storeOrUpdate(IntegrationTokenDTO $dto): void;

    public function delete(int $userId, string $type): void;
}
