<?php

namespace App\Services\Integrations;

use App\Dtos\BaseDto;
use App\Dtos\IntegrationTokenDTO;
use App\Enums\IntegrationEnum;
use App\Http\Integrations\Fitbit\FitbitConnector;
use App\Http\Integrations\Github\GithubConnector;
use App\Repositories\Contracts\IntegrationTokenRepositoryInterface;
use App\Services\Integrations\Services\Integrations\Contracts\GithubServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Saloon\Exceptions\InvalidStateException;

class GithubService implements GithubServiceInterface
{
    protected $connector;

    public function __construct(
        protected IntegrationTokenRepositoryInterface $repository,
    ){
        $this->connector = new GithubConnector();
    }

    public function getUser(string $username): BaseDto
    {
        return new BaseDto();
    }

    public function storeToken(IntegrationTokenDTO|BaseDto $dto): void
    {
        $this->repository->storeOrUpdate($dto);
    }


    public function getRedirectUrl(): string
    {
        return $this->connector->getAuthorizationUrl();
    }

    /**
     * @throws InvalidStateException
     */
    public function handleCallback(Request $request)
    {
        try {
            $authenticator = $this->connector->getAccessToken($request->input('code', ''));
            $this->storeToken(new IntegrationTokenDTO(
                user_id: auth()->id(),
                access_token: $authenticator->getAccessToken(),
                refresh_token: $authenticator->getRefreshToken(),
                expires_at: $authenticator->getExpiresAt()?->format('Y-m-d H:i:s') ?? null,
                integration: IntegrationEnum::GITHUB,
                serialized: $authenticator->serialize()
            ));
        } catch (\Exception $e){
            Log::error('Error during Github callback handling: ' . $e->getMessage());
            throw new InvalidStateException('Failed to handle Github callback: ' . $e->getMessage());
        }

    }
}
