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
use App\Repositories\Contracts\DailyStatRepositoryInterface;
use App\Http\Integrations\Github\Requests\GetUserPullRequests;
use App\Http\Integrations\Github\Requests\GetUserCommitsByAuthor;
use App\Repositories\Contracts\DailyStatMetricRepositoryInterface;
use App\Repositories\Contracts\IntegrationTokenRepositoryInterface;
use App\Services\Integrations\Services\Integrations\Contracts\GithubServiceInterface;

class GithubService implements GithubServiceInterface
{
    protected $connector;

    public function __construct(
        protected IntegrationTokenRepositoryInterface $repository,
        private DailyStatRepositoryInterface $dailyStatRepository,
        private DailyStatMetricRepositoryInterface $dailyStatMetricRepository
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
     * Get GitHub activities and store daily stats
     *
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

        // Get user info to get username
        $userResponse = $this->connector->getUser($auth);
        $user         = $userResponse->object();
        $username     = $user->login;

        // Get user repositories
        $reposResponse = $this->connector->send(new GetUserRepos($username));
        throw_if($reposResponse->failed(), new \Exception('Failed to fetch repositories'));

        $repositories = collect($reposResponse->json());

        $totalCommitsToday       = 0;
        $totalPullRequests       = 0;
        $openPullRequests        = 0;
        $mergedPullRequests      = 0;
        $closedPullRequests      = 0;
        $repositoriesContributed = 0;
        $commitsDetail           = [];
        $pullRequestsDetail      = [];

        // Process each repository to get commits and pull requests
        foreach ($repositories->take(10) as $repo) { // Limit to 10 repos to avoid rate limits
            $repoName  = $repo['name'];
            $repoOwner = $repo['owner']['login'];

            try {
                // Get today's commits by the user
                $commitsResponse = $this->connector->send(new GetUserCommitsByAuthor($repoOwner, $repoName, $username));

                if ($commitsResponse->successful()) {
                    $commits      = collect($commitsResponse->json());
                    $todayCommits = $commits->filter(function ($commit) use ($date) {
                        $commitDate = date('Y-m-d', strtotime($commit['commit']['committer']['date']));

                        return $commitDate === $date;
                    });

                    if ($todayCommits->isNotEmpty()) {
                        $repositoriesContributed++;
                        $totalCommitsToday += $todayCommits->count();

                        $commitsDetail[] = [
                            'repository'    => "{$repoOwner}/{$repoName}",
                            'commits_count' => $todayCommits->count(),
                            'commits'       => $todayCommits->map(function ($commit) {
                                return [
                                    'sha'     => $commit['sha'],
                                    'message' => $commit['commit']['message'],
                                    'date'    => $commit['commit']['committer']['date'],
                                    'url'     => $commit['html_url'],
                                ];
                            })->toArray(),
                        ];
                    }
                }

                // Get pull requests
                $prsResponse = $this->connector->send(new GetUserPullRequests($repoOwner, $repoName));

                if ($prsResponse->successful()) {
                    $pullRequests = collect($prsResponse->json());
                    $userPRs      = $pullRequests->filter(function ($pr) use ($username) {
                        return $pr['user']['login'] === $username;
                    });

                    if ($userPRs->isNotEmpty()) {
                        $totalPullRequests += $userPRs->count();
                        $openPullRequests += $userPRs->where('state', 'open')->count();
                        $mergedPullRequests += $userPRs->where('merged_at', '!=', null)->count();
                        $closedPullRequests += $userPRs->where('state', 'closed')->where('merged_at', null)->count();

                        $pullRequestsDetail[] = [
                            'repository'    => "{$repoOwner}/{$repoName}",
                            'pull_requests' => $userPRs->map(function ($pr) {
                                return [
                                    'number'     => $pr['number'],
                                    'title'      => $pr['title'],
                                    'state'      => $pr['state'],
                                    'created_at' => $pr['created_at'],
                                    'merged_at'  => $pr['merged_at'],
                                    'url'        => $pr['html_url'],
                                ];
                            })->toArray(),
                        ];
                    }
                }
            } catch (\Exception $e) {
                Log::warning("Failed to fetch data for repository {$repoOwner}/{$repoName}: " . $e->getMessage());
                continue;
            }
        }

        // Store daily stats
        $this->storeDailyStats(
            userId: $userId,
            date: $date,
            commitsToday: $totalCommitsToday,
            pullRequests: $totalPullRequests,
            openPRs: $openPullRequests,
            mergedPRs: $mergedPullRequests,
            closedPRs: $closedPullRequests,
            repositoriesContributed: $repositoriesContributed,
            commitsDetail: $commitsDetail,
            pullRequestsDetail: $pullRequestsDetail
        );
    }

    /**
     * Get GitHub daily statistics without storing them
     *
     * @throws \Throwable
     * @throws FatalRequestException
     * @throws RequestException
     * @throws \JsonException
     */
    public function getDailyStats(int $userId, ?string $date = null): array
    {
        if (!$date) {
            $date = now()->format('Y-m-d');
        }

        $integration_token = $this->repository->findByUserIdAndType($userId, IntegrationEnum::GITHUB);

        throw_if(!$integration_token, new InvalidStateException('Github integration token not found for user ID: ' . $userId));

        $auth = AccessTokenAuthenticator::unserialize($integration_token->serialized);
        $this->connector->authenticate($auth);

        // Get user info to get username
        $userResponse = $this->connector->getUser($auth);
        $user         = $userResponse->object();
        $username     = $user->login;

        // Get user repositories
        $reposResponse = $this->connector->send(new GetUserRepos($username));
        throw_if($reposResponse->failed(), new \Exception('Failed to fetch repositories'));

        $repositories = collect($reposResponse->json());

        $totalCommitsToday       = 0;
        $totalPullRequests       = 0;
        $openPullRequests        = 0;
        $mergedPullRequests      = 0;
        $closedPullRequests      = 0;
        $repositoriesContributed = 0;

        // Process each repository to get commits and pull requests
        foreach ($repositories->take(10) as $repo) { // Limit to 10 repos to avoid rate limits
            $repoName  = $repo['name'];
            $repoOwner = $repo['owner']['login'];

            try {
                // Get today's commits by the user
                $commitsResponse = $this->connector->send(new GetUserCommitsByAuthor($repoOwner, $repoName, $username));

                if ($commitsResponse->successful()) {
                    $commits      = collect($commitsResponse->json());
                    $todayCommits = $commits->filter(function ($commit) use ($date) {
                        $commitDate = date('Y-m-d', strtotime($commit['commit']['committer']['date']));

                        return $commitDate === $date;
                    });

                    if ($todayCommits->isNotEmpty()) {
                        $repositoriesContributed++;
                        $totalCommitsToday += $todayCommits->count();
                    }
                }

                // Get pull requests
                $prsResponse = $this->connector->send(new GetUserPullRequests($repoOwner, $repoName));

                if ($prsResponse->successful()) {
                    $pullRequests = collect($prsResponse->json());
                    $userPRs      = $pullRequests->filter(function ($pr) use ($username) {
                        return $pr['user']['login'] === $username;
                    });

                    if ($userPRs->isNotEmpty()) {
                        $totalPullRequests += $userPRs->count();
                        $openPullRequests += $userPRs->where('state', 'open')->count();
                        $mergedPullRequests += $userPRs->where('merged_at', '!=', null)->count();
                        $closedPullRequests += $userPRs->where('state', 'closed')->where('merged_at', null)->count();
                    }
                }
            } catch (\Exception $e) {
                Log::warning("Failed to fetch data for repository {$repoOwner}/{$repoName}: " . $e->getMessage());
                continue;
            }
        }

        return [
            'commits_today'            => $totalCommitsToday,
            'total_pull_requests'      => $totalPullRequests,
            'open_pull_requests'       => $openPullRequests,
            'merged_pull_requests'     => $mergedPullRequests,
            'closed_pull_requests'     => $closedPullRequests,
            'repositories_contributed' => $repositoriesContributed,
        ];
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

    /**
     * Store daily GitHub statistics
     */
    private function storeDailyStats(
        int $userId,
        string $date,
        int $commitsToday,
        int $pullRequests,
        int $openPRs,
        int $mergedPRs,
        int $closedPRs,
        int $repositoriesContributed,
        array $commitsDetail,
        array $pullRequestsDetail
    ): void {
        // Create or update daily stat record
        $dailyStat = $this->dailyStatRepository->updateOrCreate([
            'user_id'     => $userId,
            'integration' => IntegrationEnum::GITHUB,
            'date'        => $date,
        ], [
            'meta' => [
                'commits_detail'       => $commitsDetail,
                'pull_requests_detail' => $pullRequestsDetail,
                'updated_at'           => now()->toISOString(),
            ],
        ]);

        // Store individual metrics
        $this->createOrUpdateMetric($dailyStat->id, 'commits_today', $commitsToday);
        $this->createOrUpdateMetric($dailyStat->id, 'total_pull_requests', $pullRequests);
        $this->createOrUpdateMetric($dailyStat->id, 'open_pull_requests', $openPRs);
        $this->createOrUpdateMetric($dailyStat->id, 'merged_pull_requests', $mergedPRs);
        $this->createOrUpdateMetric($dailyStat->id, 'closed_pull_requests', $closedPRs);
        $this->createOrUpdateMetric($dailyStat->id, 'repositories_contributed', $repositoriesContributed);
    }

    /**
     * Create or update a daily stat metric
     */
    private function createOrUpdateMetric(int $dailyStatId, string $key, mixed $value): void
    {
        $this->dailyStatMetricRepository->updateOrCreate([
            'daily_stat_id' => $dailyStatId,
            'key'           => $key,
        ], [
            'value' => $value,
        ]);
    }
}
