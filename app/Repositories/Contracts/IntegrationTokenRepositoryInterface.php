<?php

namespace App\Repositories\Contracts;

use App\Dtos\IntegrationTokenDTO;

interface IntegrationTokenRepositoryInterface
{
    public function findByUserAndType(int $userId, string $type): ?array;

    public function storeOrUpdate(IntegrationTokenDTO $dto): void;

    public function delete(int $userId, string $type): void;
}
