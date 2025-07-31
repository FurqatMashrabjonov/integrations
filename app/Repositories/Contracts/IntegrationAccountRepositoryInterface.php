<?php

namespace App\Repositories\Contracts;

use App\Enums\IntegrationEnum;
use App\Models\IntegrationAccount;
use Illuminate\Database\Eloquent\Collection;

interface IntegrationAccountRepositoryInterface
{
    public function findByUserAndIntegration(int $userId, IntegrationEnum $integration): ?IntegrationAccount;

    public function findByUser(int $userId): Collection;

    public function createOrUpdate(array $data): IntegrationAccount;

    public function delete(int $userId, IntegrationEnum $integration): bool;

    public function deleteByUser(int $userId): bool;
}
