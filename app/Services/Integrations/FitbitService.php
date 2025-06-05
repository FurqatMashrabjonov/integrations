<?php

namespace App\Services\Integrations;

use App\Dtos\BaseDto;
use App\Enums\IntegrationEnum;
use App\Http\Integrations\Fitbit\FitbitConnector;
use App\Models\User;
use App\Repositories\Contracts\IntegrationTokenRepositoryInterface;
use App\Services\Integrations\Services\Integrations\Contracts\FitbitServiceInterface;
use App\DTOs\IntegrationTokenDTO;
use Carbon\Carbon;

class FitbitService implements FitbitServiceInterface
{
    protected $connector;
    protected int $user_id;

    public function __construct(
        protected IntegrationTokenRepositoryInterface $repository,
    ){
        $this->connector = new FitbitConnector();
        $this->user_id = 1; // This should be dynamic in production
    }

    public function getUser(string $username): BaseDto
    {
        $token = $this->getValidAccessToken();

        $response = $this->connector->getUser($token);

        return new BaseDto($response->json());
    }

    public function storeToken(): void
    {
        $user = User::find($this->user_id);

        $response = $this->connector->getAccessToken();

        $accessToken  = $response->json('access_token');
        $refreshToken = $response->json('refresh_token');
        $expiresIn    = $response->json('expires_in');

        $dto = new IntegrationTokenDTO(
            user_id: $user->id,
            access_token: $accessToken,
            refresh_token: $refreshToken,
            expires_at: Carbon::now()->addSeconds($expiresIn),
            integration: IntegrationEnum::FITBIT
        );

        $this->repository->storeOrUpdate($dto);
    }

    private function checkExpiringToken(IntegrationTokenDTO $dto): bool
    {
        return !$dto->expires_at || Carbon::parse($dto->expires_at)->isPast();
    }

    private function refreshToken(string $refreshToken): string
    {
        $response = $this->connector->refreshAccessToken($refreshToken);

        $newAccessToken  = $response->json('access_token');
        $newRefreshToken = $response->json('refresh_token');
        $expiresIn       = $response->json('expires_in');

        $dto = new IntegrationTokenDTO(
            user_id: $this->user_id,
            access_token: $newAccessToken,
            refresh_token: $newRefreshToken,
            expires_at: Carbon::now()->addSeconds($expiresIn),
            integration: IntegrationEnum::FITBIT
        );

        $this->repository->storeOrUpdate($dto);

        return $newAccessToken;
    }

    private function getValidAccessToken(): string
    {
        $dto = $this->repository->findByUserAndType($this->user_id, IntegrationEnum::FITBIT->value);

        if (!$dto) {
            // No token found → fetch it
            $this->storeToken();
            $dto = $this->repository->findByUserAndType($this->user_id, IntegrationEnum::FITBIT->value);
        }

        if ($this->checkExpiringToken($dto)) {
            return $this->refreshToken($dto->refresh_token);
        }

        return $dto->access_token;
    }
}
