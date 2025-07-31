<?php

namespace Database\Factories;

use App\Models\User;
use App\Enums\IntegrationEnum;
use App\Models\IntegrationAccount;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\IntegrationAccount>
 */
class IntegrationAccountFactory extends Factory
{
    protected $model = IntegrationAccount::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $integration = $this->faker->randomElement(IntegrationEnum::cases());

        return [
            'user_id' => User::factory(),
            'display_name' => $this->faker->userName(),
            'full_name' => $this->faker->name(),
            'avatar' => $this->faker->imageUrl(200, 200, 'people'),
            'integration' => $integration,
            'data' => $this->generateDataForIntegration($integration),
        ];
    }

    /**
     * Generate sample data based on integration type
     */
    private function generateDataForIntegration(IntegrationEnum $integration): array
    {
        return match($integration) {
            IntegrationEnum::GITHUB => [
                'login' => $this->faker->userName(),
                'name' => $this->faker->name(),
                'avatar_url' => $this->faker->imageUrl(200, 200, 'people'),
                'public_repos' => $this->faker->numberBetween(0, 100),
                'followers' => $this->faker->numberBetween(0, 1000),
                'following' => $this->faker->numberBetween(0, 500),
                'created_at' => $this->faker->dateTime()->format('Y-m-d\TH:i:s\Z'),
            ],
            IntegrationEnum::LEETCODE => [
                'username' => $this->faker->userName(),
                'realName' => $this->faker->name(),
                'avatar' => $this->faker->imageUrl(200, 200, 'people'),
                'ranking' => $this->faker->numberBetween(1, 100000),
                'reputation' => $this->faker->numberBetween(0, 10000),
                'problemsSolved' => $this->faker->numberBetween(0, 2000),
            ],
            IntegrationEnum::FITBIT => [
                'displayName' => $this->faker->firstName() . ' ' . substr($this->faker->lastName(), 0, 1) . '.',
                'fullName' => $this->faker->name(),
                'avatar' => $this->faker->imageUrl(200, 200, 'people'),
                'memberSince' => $this->faker->date(),
                'timezone' => $this->faker->timezone(),
            ],
            IntegrationEnum::WAKAPI => [
                'username' => $this->faker->userName(),
                'full_name' => $this->faker->name(),
                'photo' => $this->faker->imageUrl(200, 200, 'people'),
                'total_seconds' => $this->faker->numberBetween(0, 86400),
                'languages_used' => $this->faker->numberBetween(1, 10),
            ],
        };
    }

    /**
     * Create a GitHub integration account
     */
    public function github(): static
    {
        return $this->state(fn (array $attributes) => [
            'integration' => IntegrationEnum::GITHUB,
            'data' => $this->generateDataForIntegration(IntegrationEnum::GITHUB),
        ]);
    }

    /**
     * Create a Leetcode integration account
     */
    public function leetcode(): static
    {
        return $this->state(fn (array $attributes) => [
            'integration' => IntegrationEnum::LEETCODE,
            'data' => $this->generateDataForIntegration(IntegrationEnum::LEETCODE),
        ]);
    }

    /**
     * Create a Fitbit integration account
     */
    public function fitbit(): static
    {
        return $this->state(fn (array $attributes) => [
            'integration' => IntegrationEnum::FITBIT,
            'data' => $this->generateDataForIntegration(IntegrationEnum::FITBIT),
        ]);
    }

    /**
     * Create a Wakapi integration account
     */
    public function wakapi(): static
    {
        return $this->state(fn (array $attributes) => [
            'integration' => IntegrationEnum::WAKAPI,
            'data' => $this->generateDataForIntegration(IntegrationEnum::WAKAPI),
        ]);
    }
}
