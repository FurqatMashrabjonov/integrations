<?php

namespace App\Repositories;

use App\Enums\IntegrationEnum;
use App\Models\IntegrationAccount;
use Illuminate\Database\Eloquent\Collection;
use App\Repositories\Contracts\IntegrationAccountRepositoryInterface;

class IntegrationAccountRepository implements IntegrationAccountRepositoryInterface
{
    public function __construct(protected IntegrationAccount $model) {}

    public function findByUserAndIntegration(int $userId, IntegrationEnum $integration): ?IntegrationAccount
    {
        return $this->model->newQuery()
            ->where('user_id', $userId)
            ->where('integration', $integration)
            ->first();
    }

    public function findByUser(int $userId): Collection
    {
        return $this->model->newQuery()
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function createOrUpdate(array $data): IntegrationAccount
    {
        return $this->model->newQuery()->updateOrCreate([
            'user_id'     => $data['user_id'],
            'integration' => $data['integration'],
        ], $data);
    }

    public function delete(int $userId, IntegrationEnum $integration): bool
    {
        return $this->model->newQuery()
            ->where('user_id', $userId)
            ->where('integration', $integration)
            ->delete() > 0;
    }

    public function deleteByUser(int $userId): bool
    {
        return $this->model->newQuery()
            ->where('user_id', $userId)
            ->delete() > 0;
    }
}
