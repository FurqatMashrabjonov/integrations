<?php

namespace App\Services;

use App\Enums\IntegrationEnum;
use App\Models\IntegrationAccount;
use Illuminate\Database\Eloquent\Collection;
use App\Repositories\Contracts\IntegrationAccountRepositoryInterface;

class IntegrationAccountService
{
    public function __construct(
        protected IntegrationAccountRepositoryInterface $repository
    ) {}

    public function getByUserAndIntegration(int $userId, IntegrationEnum $integration): ?IntegrationAccount
    {
        return $this->repository->findByUserAndIntegration($userId, $integration);
    }

    public function getUserIntegrations(int $userId): Collection
    {
        return $this->repository->findByUser($userId);
    }

    public function createOrUpdateAccount(
        int $userId,
        IntegrationEnum $integration,
        ?string $displayName = null,
        ?string $fullName = null,
        ?string $avatar = null,
        array $data = []
    ): IntegrationAccount {
        return $this->repository->createOrUpdate([
            'user_id'      => $userId,
            'integration'  => $integration,
            'display_name' => $displayName,
            'full_name'    => $fullName,
            'avatar'       => $avatar,
            'data'         => $data,
        ]);
    }

    public function syncAccountData(
        int $userId,
        IntegrationEnum $integration,
        array $responseData,
        ?string $displayName = null,
        ?string $fullName = null,
        ?string $avatar = null
    ): IntegrationAccount {
        return $this->repository->createOrUpdate([
            'user_id'      => $userId,
            'integration'  => $integration,
            'display_name' => $displayName ?? $this->extractDisplayName($integration, $responseData),
            'full_name'    => $fullName ?? $this->extractFullName($integration, $responseData),
            'avatar'       => $avatar ?? $this->extractAvatar($integration, $responseData),
            'data'         => $responseData,
        ]);
    }

    public function removeIntegration(int $userId, IntegrationEnum $integration): bool
    {
        return $this->repository->delete($userId, $integration);
    }

    public function removeAllUserIntegrations(int $userId): bool
    {
        return $this->repository->deleteByUser($userId);
    }

    private function extractDisplayName(IntegrationEnum $integration, array $data): ?string
    {
        return match ($integration) {
            IntegrationEnum::GITHUB => $data['login'] ?? null,
            IntegrationEnum::LEETCODE, IntegrationEnum::WAKAPI => $data['username'] ?? null,
            IntegrationEnum::FITBIT => $data['displayName'] ?? null,
        };
    }

    private function extractFullName(IntegrationEnum $integration, array $data): ?string
    {
        return match ($integration) {
            IntegrationEnum::GITHUB   => $data['name'] ?? null,
            IntegrationEnum::LEETCODE => $data['realName'] ?? null,
            IntegrationEnum::FITBIT   => $data['fullName'] ?? null,
            IntegrationEnum::WAKAPI   => $data['full_name'] ?? null,
        };
    }

    private function extractAvatar(IntegrationEnum $integration, array $data): ?string
    {
        return match ($integration) {
            IntegrationEnum::GITHUB => $data['avatar_url'] ?? null,
            IntegrationEnum::LEETCODE, IntegrationEnum::FITBIT => $data['avatar'] ?? null,
            IntegrationEnum::WAKAPI => $data['photo'] ?? null,
        };
    }
}
