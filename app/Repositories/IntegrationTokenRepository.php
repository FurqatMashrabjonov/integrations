<?php

namespace App\Repositories;

use App\Enums\IntegrationEnum;
use App\Models\IntegrationToken;
use App\Dtos\IntegrationTokenDTO;
use App\Repositories\Contracts\IntegrationTokenRepositoryInterface;

class IntegrationTokenRepository implements IntegrationTokenRepositoryInterface
{
    public function __construct(protected IntegrationToken $model) {}

    public function findByUserIdAndType(int $userId, IntegrationEnum $type)
    {
        return $this->model->newQuery()->where('user_id', $userId)
            ->where('integration', $type->value)
            ->first();
    }

    public function storeOrUpdate(IntegrationTokenDTO $dto): void
    {
        $this->model->newQuery()->updateOrCreate([
            'user_id'     => $dto->user_id,
            'integration' => $dto->integration,
        ], [
            'access_token'  => $dto->access_token,
            'refresh_token' => $dto->refresh_token,
            'expires_at'    => $dto->expires_at,
            'serialized'    => $dto->serialized,
        ]);
    }

    public function delete(int $userId, string $type): void
    {
        IntegrationToken::where('user_id', $userId)
            ->where('type', $type)
            ->delete();
    }
}
