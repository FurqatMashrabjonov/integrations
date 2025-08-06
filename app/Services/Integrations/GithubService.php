<?php

namespace App\Services\Integrations;

use App\Dtos\BaseDto;
use Illuminate\Http\Request;
use App\Enums\IntegrationEnum;
use App\Dtos\IntegrationTokenDTO;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Saloon\Exceptions\InvalidStateException;
use Saloon\Http\Auth\AccessTokenAuthenticator;
use Saloon\Exceptions\Request\RequestException;
use App\Http\Integrations\Github\GithubConnector;
use Saloon\Exceptions\Request\FatalRequestException;
use App\Http\Integrations\Github\Requests\GetUserRepos;
use App\Http\Integrations\Github\Requests\GetUserCommits;
use App\Repositories\Contracts\IntegrationTokenRepositoryInterface;
use App\Services\Integrations\Services\Integrations\Contracts\GithubServiceInterface;

class GithubService implements GithubServiceInterface
{
    protected $connector;

    public function __construct(
        protected IntegrationTokenRepositoryInterface $repository,
    ) {
        $this->connector = new GithubConnector;
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
     * @throws InvalidStateException
     */
    public function handleCallback(Request $request)
    {
        try {
            $authenticator = $this->connector->getAccessToken($request->input('code', ''));
            $this->storeToken(new IntegrationTokenDTO(
                user_id: Auth::id(),
                integration: IntegrationEnum::GITHUB,
                access_token: $authenticator->getAccessToken(),
                refresh_token: $authenticator->getRefreshToken(),
                expires_at: $authenticator->getExpiresAt()?->format('Y-m-d H:i:s') ?? null,
                serialized: serialize($authenticator)
            ));

            $this->createIntegrationAccount($authenticator);
        } catch (\Exception $e) {
            Log::error('Error during Github callback handling: ' . $e->getMessage());

            throw new InvalidStateException('Failed to handle Github callback: ' . $e->getMessage());
        }
    }

    /**
     * @throws \Throwable
     * @throws FatalRequestException
     * @throws RequestException
     * @throws \JsonException
     */
    public function getActivitiesAndStore(int $userId, ?string $date = null): void
    {
        if (!$date) {
            $date = now()->format('Y-m-d');
        }

        $integration_token = $this->repository->findByUserIdAndType($userId, IntegrationEnum::GITHUB);

        throw_if(!$integration_token, new InvalidStateException('Github integration token not found for user ID: ' . $userId));

        $auth = AccessTokenAuthenticator::unserialize($integration_token->serialized);

        $this->connector->authenticate($auth);
        $response = $this->connector->send(new GetUserCommits('furqatmashrabjonov', 'mockapi'));

        throw_if(isset($response->error));

        dd(json_encode($response->json()));

        //        $steps = $response?->object()?->summary?->steps ?? 0;
        //
        //        $this->userFitbitStepRepository->storeOrUpdate(new UserFitbitStepDTO(
        //            user_id: $userId,
        //            date: $date,
        //            steps: $steps,
        //        ));
    }

    public function getUserRepos(int $userId)
    {
        $integration_token = $this->repository->findByUserIdAndType($userId, IntegrationEnum::GITHUB);

        throw_if(!$integration_token, new InvalidStateException('Github integration token not found for user ID: ' . $userId));

        $auth = AccessTokenAuthenticator::unserialize($integration_token->serialized);

        $this->connector->authenticate($auth);
        $response = $this->connector->send(new GetUserRepos('furqatmashrabjonov'));

        throw_if(isset($response->error));

        dd(json_encode($response->json()));
    }

    protected function createIntegrationAccount($authenticator): void
    {
        $user = $this->connector->getUser($authenticator)->object();

        // Use IntegrationAccount directly via repository
        $integrationAccountRepo = app(\App\Repositories\Contracts\IntegrationAccountRepositoryInterface::class);

        $integrationAccountRepo->createOrUpdate([
            'user_id'      => Auth::id(),
            'integration'  => IntegrationEnum::GITHUB,
            'display_name' => $user->login ?? '',
            'full_name'    => $user->name ?? '',
            'avatar'       => $user->avatar_url ?? '',
            'data'         => [
                'display_name' => $user->login ?? '',
                'full_name'    => $user->name ?? '',
                'avatar'       => $user->avatar_url ?? '',
                'login'        => $user->login ?? '',
                'connected_at' => now()->toISOString(),
            ],
        ]);
    }
}
