<?php

namespace App\Services\Integrations;

use App\Dtos\BaseDto;
use Illuminate\Http\Request;
use App\Dtos\FitbitAccountDTO;
use App\Enums\IntegrationEnum;
use App\Dtos\UserFitbitStepDTO;
use App\Dtos\IntegrationTokenDTO;
use Illuminate\Support\Facades\Log;
use Saloon\Exceptions\InvalidStateException;
use Saloon\Http\Auth\AccessTokenAuthenticator;
use Saloon\Exceptions\Request\RequestException;
use App\Http\Integrations\Fitbit\FitbitConnector;
use Saloon\Exceptions\Request\FatalRequestException;
use App\Http\Integrations\Fitbit\Requests\GetUserStepsRequest;
use App\Repositories\Contracts\FitbitAccountRepositoryInterface;
use App\Repositories\Contracts\UserFitbitStepRepositoryInterface;
use App\Repositories\Contracts\IntegrationTokenRepositoryInterface;
use App\Services\Integrations\Services\Integrations\Contracts\FitbitServiceInterface;

class FitbitService implements FitbitServiceInterface
{
    protected $connector;

    public function __construct(
        protected IntegrationTokenRepositoryInterface $repository,
        protected FitbitAccountRepositoryInterface $fitbitAccountRepository,
        protected UserFitbitStepRepositoryInterface $userFitbitStepRepository,
    ) {
        $this->connector = new FitbitConnector;
    }

    public function getUser(string $username): BaseDto
    {
        return new BaseDto;
    }

    public function storeToken(IntegrationTokenDTO $dto): void
    {
        $this->repository->storeOrUpdate($dto);
    }

    public function getRedirectUrl(): string
    {
        return $this->connector->getAuthorizationUrl();
    }

    /**
     * @throws FatalRequestException
     * @throws \Throwable
     * @throws RequestException
     */
    public function getUserStepsAndStore(int $userId, ?string $date = null)
    {
        if (!$date) {
            $date = now()->format('Y-m-d');
        }

        $integration_token = $this->repository->findByUserIdAndType($userId, IntegrationEnum::FITBIT);

        throw_if(!$integration_token, new InvalidStateException('Fitbit integration token not found for user ID: ' . $userId));

        $auth = AccessTokenAuthenticator::unserialize($integration_token->serialized);

        $this->refreshIfExpired($auth);

        $this->connector->authenticate($auth);
        $response = $this->connector->send(new GetUserStepsRequest($date));

        throw_if(isset($response->error));

        Log::info(json_encode($response->json()));

        $steps = $response?->object()?->summary->steps ?? 0;

        $this->userFitbitStepRepository->storeOrUpdate(new UserFitbitStepDTO(
            user_id: $userId,
            date: $date,
            steps: $steps,
        ));

        return $steps;
    }

    public function refreshIfExpired(AccessTokenAuthenticator $authenticator): void
    {
        if ($authenticator->hasExpired()) {
            $authenticator = $this->connector->refreshAccessToken($authenticator);
            $this->connector->authenticate($authenticator);
        }
    }

    /**
     * @throws InvalidStateException
     */
    public function handleCallback(Request $request)
    {
        try {
            $authenticator = $this->connector->getAccessToken($request->input('code', ''));

            $this->storeToken(new IntegrationTokenDTO(
                user_id: auth()->id() ?? 1,
                integration: IntegrationEnum::FITBIT,
                access_token: $authenticator->getAccessToken(),
                refresh_token: $authenticator->getRefreshToken(),
                expires_at: $authenticator->getExpiresAt()->format('Y-m-d H:i:s'),
                serialized: $authenticator->serialize(),
            ));

            $this->storeFitbitAccount($authenticator);
        } catch (\Exception $e) {
            Log::error('Error during Fitbit callback handling: ' . $e->getMessage());

            throw new InvalidStateException('Failed to handle Fitbit callback: ' . $e->getMessage());
        }
    }

    protected function storeFitbitAccount($authenticator): void
    {
        $user = $this->connector->getUser($authenticator)->object()?->user;

        $this->fitbitAccountRepository->storeOrUpdate(new FitbitAccountDTO(
            user_id: auth()->id(),
            display_name: $user->displayName ?? '',
            full_name: $user->fullName ?? '',
            avatar: $user->avatar ?? ''
        ));
    }
}
