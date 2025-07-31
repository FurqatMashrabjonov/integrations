<?php

    public function test_integration_account_scopes_work(): void
    {
        IntegrationAccount::factory()->create([
            'user_id' => $this->user->id,
            'integration' => IntegrationEnum::GITHUB,
        ]);

        IntegrationAccount::factory()->create([
            'user_id' => $this->user->id,
            'integration' => IntegrationEnum::LEETCODE,
        ]);

        $otherUser = User::factory()->create();
        IntegrationAccount::factory()->create([
            'user_id' => $otherUser->id,
            'integration' => IntegrationEnum::GITHUB,
        ]);

        // Test byUser scope
        $userAccounts = IntegrationAccount::byUser($this->user->id)->get();
        $this->assertCount(2, $userAccounts);

        // Test byIntegration scope
        $githubAccounts = IntegrationAccount::byIntegration(IntegrationEnum::GITHUB)->get();
        $this->assertCount(2, $githubAccounts);

        // Test combined scopes
        $userGithubAccounts = IntegrationAccount::byUser($this->user->id)
            ->byIntegration(IntegrationEnum::GITHUB)
            ->get();
        $this->assertCount(1, $userGithubAccounts);
    }

    public function test_unique_constraint_prevents_duplicate_user_integration_pairs(): void
    {
        IntegrationAccount::factory()->create([
            'user_id' => $this->user->id,
            'integration' => IntegrationEnum::GITHUB,

namespace Tests\Feature\Integrations;

use Tests\TestCase;
use App\Models\User;
use App\Enums\IntegrationEnum;
use App\Models\IntegrationAccount;
use App\Services\IntegrationAccountService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Repositories\Contracts\IntegrationAccountRepositoryInterface;

class IntegrationAccountTest extends TestCase
{
    use RefreshDatabase;

    private IntegrationAccountService $service;
    private IntegrationAccountRepositoryInterface $repository;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = app(IntegrationAccountService::class);
        $this->repository = app(IntegrationAccountRepositoryInterface::class);
        $this->user = User::factory()->create();
    }

    public function test_can_create_integration_account(): void
    {
        $integrationData = [
            'user_id' => $this->user->id,
            'integration' => IntegrationEnum::GITHUB,
            'display_name' => 'john_doe',
            'full_name' => 'John Doe',
            'avatar' => 'https://github.com/avatar.jpg',
            'data' => [
                'login' => 'john_doe',
                'name' => 'John Doe',
                'avatar_url' => 'https://github.com/avatar.jpg',
                'public_repos' => 42,
                'followers' => 100,
            ],
        ];

        $account = $this->repository->createOrUpdate($integrationData);

        $this->assertInstanceOf(IntegrationAccount::class, $account);
        $this->assertEquals($this->user->id, $account->user_id);
        $this->assertEquals(IntegrationEnum::GITHUB, $account->integration);
        $this->assertEquals('john_doe', $account->display_name);
        $this->assertEquals('John Doe', $account->full_name);
        $this->assertEquals('https://github.com/avatar.jpg', $account->avatar);
        $this->assertArrayHasKey('login', $account->data);
        $this->assertEquals('john_doe', $account->data['login']);

        $this->assertDatabaseHas('integration_accounts', [
            'user_id' => $this->user->id,
            'integration' => 'github',
            'display_name' => 'john_doe',
            'full_name' => 'John Doe',
        ]);
    }

    public function test_can_update_existing_integration_account(): void
    {
        // Create initial account
        $initialData = [
            'user_id' => $this->user->id,
            'integration' => IntegrationEnum::GITHUB,
            'display_name' => 'old_username',
            'full_name' => 'Old Name',
            'avatar' => 'https://old-avatar.jpg',
            'data' => ['old' => 'data'],
        ];

        $account = $this->repository->createOrUpdate($initialData);
        $accountId = $account->id;

        // Update the account
        $updatedData = [
            'user_id' => $this->user->id,
            'integration' => IntegrationEnum::GITHUB,
            'display_name' => 'new_username',
            'full_name' => 'New Name',
            'avatar' => 'https://new-avatar.jpg',
            'data' => ['new' => 'data', 'updated' => true],
        ];

        $updatedAccount = $this->repository->createOrUpdate($updatedData);

        $this->assertEquals($accountId, $updatedAccount->id);
        $this->assertEquals('new_username', $updatedAccount->display_name);
        $this->assertEquals('New Name', $updatedAccount->full_name);
        $this->assertEquals('https://new-avatar.jpg', $updatedAccount->avatar);
        $this->assertArrayHasKey('new', $updatedAccount->data);
        $this->assertTrue($updatedAccount->data['updated']);

        // Ensure only one record exists
        $this->assertEquals(1, IntegrationAccount::where('user_id', $this->user->id)
            ->where('integration', IntegrationEnum::GITHUB)
            ->count());
    }

    public function test_can_find_integration_account_by_user_and_integration(): void
    {
        $account = IntegrationAccount::factory()->create([
            'user_id' => $this->user->id,
            'integration' => IntegrationEnum::LEETCODE,
            'display_name' => 'leetcode_user',
        ]);

        $foundAccount = $this->repository->findByUserAndIntegration($this->user->id, IntegrationEnum::LEETCODE);

        $this->assertNotNull($foundAccount);
        $this->assertEquals($account->id, $foundAccount->id);
        $this->assertEquals('leetcode_user', $foundAccount->display_name);
    }

    public function test_returns_null_when_integration_account_not_found(): void
    {
        $foundAccount = $this->repository->findByUserAndIntegration($this->user->id, IntegrationEnum::FITBIT);

        $this->assertNull($foundAccount);
    }

    public function test_can_find_all_user_integration_accounts(): void
    {
        IntegrationAccount::factory()->create([
            'user_id' => $this->user->id,
            'integration' => IntegrationEnum::GITHUB,
        ]);

        IntegrationAccount::factory()->create([
            'user_id' => $this->user->id,
            'integration' => IntegrationEnum::LEETCODE,
        ]);

        IntegrationAccount::factory()->create([
            'user_id' => $this->user->id,
            'integration' => IntegrationEnum::FITBIT,
        ]);

        // Create account for different user (should not be included)
        $otherUser = User::factory()->create();
        IntegrationAccount::factory()->create([
            'user_id' => $otherUser->id,
            'integration' => IntegrationEnum::WAKAPI,
        ]);

        $userAccounts = $this->repository->findByUser($this->user->id);

        $this->assertCount(3, $userAccounts);
        $this->assertTrue($userAccounts->every(fn($account) => $account->user_id === $this->user->id));
    }

    public function test_can_delete_integration_account(): void
    {
        IntegrationAccount::factory()->create([
            'user_id' => $this->user->id,
            'integration' => IntegrationEnum::GITHUB,
        ]);

        $this->assertDatabaseHas('integration_accounts', [
            'user_id' => $this->user->id,
            'integration' => 'github',
        ]);

        $deleted = $this->repository->delete($this->user->id, IntegrationEnum::GITHUB);

        $this->assertTrue($deleted);
        $this->assertDatabaseMissing('integration_accounts', [
            'user_id' => $this->user->id,
            'integration' => 'github',
        ]);
    }

    public function test_delete_returns_false_when_account_not_found(): void
    {
        $deleted = $this->repository->delete($this->user->id, IntegrationEnum::GITHUB);

        $this->assertFalse($deleted);
    }

    public function test_can_delete_all_user_integration_accounts(): void
    {
        IntegrationAccount::factory()->create([
            'user_id' => $this->user->id,
            'integration' => IntegrationEnum::GITHUB,
        ]);

        IntegrationAccount::factory()->create([
            'user_id' => $this->user->id,
            'integration' => IntegrationEnum::LEETCODE,
        ]);

        // Create account for different user (should not be deleted)
        $otherUser = User::factory()->create();
        IntegrationAccount::factory()->create([
            'user_id' => $otherUser->id,
            'integration' => IntegrationEnum::WAKAPI,
        ]);

        $this->assertEquals(2, IntegrationAccount::where('user_id', $this->user->id)->count());
        $this->assertEquals(1, IntegrationAccount::where('user_id', $otherUser->id)->count());

        $deleted = $this->repository->deleteByUser($this->user->id);

        $this->assertTrue($deleted);
        $this->assertEquals(0, IntegrationAccount::where('user_id', $this->user->id)->count());
        $this->assertEquals(1, IntegrationAccount::where('user_id', $otherUser->id)->count());
    }

    public function test_service_can_sync_github_account_data(): void
    {
        $githubResponse = [
            'login' => 'octocat',
            'name' => 'The Octocat',
            'avatar_url' => 'https://github.com/images/error/octocat_happy.gif',
            'public_repos' => 8,
            'followers' => 5000,
            'following' => 9,
        ];

        $account = $this->service->syncAccountData(
            userId: $this->user->id,
            integration: IntegrationEnum::GITHUB,
            responseData: $githubResponse
        );

        $this->assertEquals($this->user->id, $account->user_id);
        $this->assertEquals(IntegrationEnum::GITHUB, $account->integration);
        $this->assertEquals('octocat', $account->display_name);
        $this->assertEquals('The Octocat', $account->full_name);
        $this->assertEquals('https://github.com/images/error/octocat_happy.gif', $account->avatar);
        $this->assertEquals($githubResponse, $account->data);
    }

    public function test_service_can_sync_leetcode_account_data(): void
    {
        $leetcodeResponse = [
            'username' => 'leetcode_user',
            'realName' => 'Leetcode User',
            'avatar' => 'https://leetcode.com/avatar.png',
            'ranking' => 12345,

