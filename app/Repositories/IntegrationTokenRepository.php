<?php

namespace App\Repositories;

use App\Dtos\IntegrationTokenDTO;
use App\Models\IntegrationToken;
use App\Repositories\Contracts\IntegrationTokenRepositoryInterface;

class IntegrationTokenRepository implements IntegrationTokenRepositoryInterface
{
    public function __construct(protected IntegrationToken $model)
    {
    }

    public function findByUserAndType(int $userId, string $type): ?array
    {
        return IntegrationToken::where('user_id', $userId)
            ->where('type', $type)
            ->first()?->toArray();
    }

    public function storeOrUpdate(IntegrationTokenDTO $dto): void
    {
        $this->model->newQuery()->updateOrCreate([
            'user_id' => $dto->user_id,
            'integration' => $dto->integration,
        ], [
            'access_token' => $dto->access_token,
            'refresh_token' => $dto->refresh_token,
            'expires_at' => $dto->expires_at,
        ]);
    }

    public function delete(int $userId, string $type): void
    {
        IntegrationToken::where('user_id', $userId)
            ->where('type', $type)
            ->delete();
    }
}
