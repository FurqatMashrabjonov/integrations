<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\DailyStat;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DailyStat>
 */
class DailyStatFactory extends Factory
{
    protected $model = DailyStat::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $provider = $this->faker->randomElement(['github', 'leetcode', 'wakapi', 'fitbit']);

        return [
            'user_id'  => User::factory(),
            'date'     => $this->faker->unique()->dateTimeBetween('-30 days', 'now')->format('Y-m-d'),
            'provider' => $provider,
            'meta'     => $this->generateMetaForProvider($provider),
        ];
    }

    /**
     * Generate provider-specific meta data
     */
    private function generateMetaForProvider(string $provider): array
    {
        return match ($provider) {
            'github' => [
                'repositories_updated' => $this->faker->numberBetween(1, 5),
                'languages'            => $this->faker->randomElements(['PHP', 'JavaScript', 'Python', 'Go'], $this->faker->numberBetween(1, 3)),
                'total_repos'          => $this->faker->numberBetween(10, 100),
            ],
            'leetcode' => [
                'streak_days'             => $this->faker->numberBetween(0, 100),
                'difficulty_distribution' => [
                    'easy'   => $this->faker->numberBetween(0, 10),
                    'medium' => $this->faker->numberBetween(0, 5),
                    'hard'   => $this->faker->numberBetween(0, 2),
                ],
                'contest_participated' => $this->faker->boolean(20),
            ],
            'wakapi' => [
                'active_projects' => $this->faker->numberBetween(1, 10),
                'top_language'    => $this->faker->randomElement(['PHP', 'JavaScript', 'Python', 'TypeScript']),
                'editors_used'    => $this->faker->randomElements(['VS Code', 'PhpStorm', 'Vim', 'Sublime'], $this->faker->numberBetween(1, 2)),
            ],
            'fitbit' => [
                'sleep_hours'      => round($this->faker->numberBetween(4, 10) + $this->faker->randomFloat(2, 0, 0.99), 2),
                'active_minutes'   => $this->faker->numberBetween(0, 200),
                'heart_rate_zones' => [
                    'fat_burn' => $this->faker->numberBetween(0, 60),
                    'cardio'   => $this->faker->numberBetween(0, 30),
                    'peak'     => $this->faker->numberBetween(0, 15),
                ],
            ],
        };
    }

    /**
     * Create a GitHub daily stat
     */
    public function github(): static
    {
        return $this->state(fn (array $attributes) => [
            'provider' => 'github',
            'meta'     => $this->generateMetaForProvider('github'),
        ]);
    }

    /**
     * Create a Leetcode daily stat
     */
    public function leetcode(): static
    {
        return $this->state(fn (array $attributes) => [
            'provider' => 'leetcode',
            'meta'     => $this->generateMetaForProvider('leetcode'),
        ]);
    }

    /**
     * Create a Wakapi daily stat
     */
    public function wakapi(): static
    {
        return $this->state(fn (array $attributes) => [
            'provider' => 'wakapi',
            'meta'     => $this->generateMetaForProvider('wakapi'),
        ]);
    }

    /**
     * Create a Fitbit daily stat
     */
    public function fitbit(): static
    {
        return $this->state(fn (array $attributes) => [
            'provider' => 'fitbit',
            'meta'     => $this->generateMetaForProvider('fitbit'),
        ]);
    }

    /**
     * Create stat for specific date
     */
    public function forDate(string $date): static
    {
        return $this->state(fn (array $attributes) => [
            'date' => $date,
        ]);
    }

    /**
     * Create stat for today
     */
    public function today(): static
    {
        return $this->state(fn (array $attributes) => [
            'date' => now()->format('Y-m-d'),
        ]);
    }
}
