<?php

namespace Database\Factories;

use App\Models\DailyStat;
use App\Models\DailyStatMetric;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DailyStatMetric>
 */
class DailyStatMetricFactory extends Factory
{
    protected $model = DailyStatMetric::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $metricType = $this->faker->randomElement([
            'commit_count', 'pr_count', 'issues_closed', // GitHub
            'problems_easy', 'problems_medium', 'problems_hard', // Leetcode
            'coding_minutes', 'active_time', 'keystrokes', // Wakapi
            'steps', 'calories_burned', 'distance_km', // Fitbit
        ]);

        return [
            'daily_stat_id' => DailyStat::factory(),
            'type'          => $metricType,
            'value'         => $this->generateValueForType($metricType),
            'unit'          => $this->getUnitForType($metricType),
            'meta'          => $this->generateMetaForType($metricType),
        ];
    }

    /**
     * Generate realistic values based on metric type
     */
    private function generateValueForType(string $type): float
    {
        return match ($type) {
            'commit_count'    => $this->faker->numberBetween(0, 20),
            'pr_count'        => $this->faker->numberBetween(0, 5),
            'issues_closed'   => $this->faker->numberBetween(0, 10),
            'problems_easy'   => $this->faker->numberBetween(0, 5),
            'problems_medium' => $this->faker->numberBetween(0, 3),
            'problems_hard'   => $this->faker->numberBetween(0, 1),
            'coding_minutes'  => $this->faker->numberBetween(0, 480), // 0-8 hours
            'active_time'     => $this->faker->numberBetween(0, 300), // 0-5 hours
            'keystrokes'      => $this->faker->numberBetween(0, 15000),
            'steps'           => $this->faker->numberBetween(0, 20000),
            'calories_burned' => $this->faker->numberBetween(1200, 3500),
            'distance_km'     => round($this->faker->numberBetween(0, 15) + $this->faker->randomFloat(2, 0, 0.99), 2),
            default           => $this->faker->numberBetween(0, 100),
        };
    }

    /**
     * Get appropriate unit for metric type
     */
    private function getUnitForType(string $type): ?string
    {
        return match ($type) {
            'commit_count', 'pr_count', 'issues_closed', 'problems_easy', 'problems_medium', 'problems_hard' => 'count',
            'coding_minutes', 'active_time' => 'minutes',
            'keystrokes'      => 'keystrokes',
            'steps'           => 'steps',
            'calories_burned' => 'calories',
            'distance_km'     => 'km',
            default           => null,
        };
    }

    /**
     * Generate meta data based on metric type
     */
    private function generateMetaForType(string $type): ?array
    {
        return match ($type) {
            'commit_count' => [
                'repositories' => $this->faker->randomElements(['repo1', 'repo2', 'repo3'], $this->faker->numberBetween(1, 3)),
                'languages'    => $this->faker->randomElements(['PHP', 'JavaScript', 'Python'], $this->faker->numberBetween(1, 2)),
            ],
            'pr_count' => [
                'status'       => $this->faker->randomElements(['merged', 'open', 'closed'], $this->faker->numberBetween(1, 2)),
                'repositories' => $this->faker->randomElements(['repo1', 'repo2'], $this->faker->numberBetween(1, 2)),
            ],
            'problems_easy', 'problems_medium', 'problems_hard' => [
                'topics'            => $this->faker->randomElements(['Array', 'String', 'Dynamic Programming', 'Tree'], $this->faker->numberBetween(1, 3)),
                'submission_status' => $this->faker->randomElement(['Accepted', 'Wrong Answer', 'Time Limit Exceeded']),
            ],
            'coding_minutes' => [
                'languages' => [
                    'PHP'        => $this->faker->numberBetween(0, 120),
                    'JavaScript' => $this->faker->numberBetween(0, 90),
                    'Python'     => $this->faker->numberBetween(0, 60),
                ],
                'projects' => $this->faker->randomElements(['project1', 'project2', 'project3'], $this->faker->numberBetween(1, 2)),
            ],
            'steps' => [
                'floors_climbed'      => $this->faker->numberBetween(0, 20),
                'very_active_minutes' => $this->faker->numberBetween(0, 60),
            ],
            'calories_burned' => [
                'bmr_calories'      => $this->faker->numberBetween(1200, 1800),
                'activity_calories' => $this->faker->numberBetween(200, 1000),
            ],
            default => null,
        };
    }

    /**
     * Create a GitHub metric
     */
    public function github(): static
    {
        $githubTypes = ['commit_count', 'pr_count', 'issues_closed'];
        $type        = $this->faker->randomElement($githubTypes);

        return $this->state(fn (array $attributes) => [
            'type'  => $type,
            'value' => $this->generateValueForType($type),
            'unit'  => $this->getUnitForType($type),
            'meta'  => $this->generateMetaForType($type),
        ]);
    }

    /**
     * Create a Leetcode metric
     */
    public function leetcode(): static
    {
        $leetcodeTypes = ['problems_easy', 'problems_medium', 'problems_hard'];
        $type          = $this->faker->randomElement($leetcodeTypes);

        return $this->state(fn (array $attributes) => [
            'type'  => $type,
            'value' => $this->generateValueForType($type),
            'unit'  => $this->getUnitForType($type),
            'meta'  => $this->generateMetaForType($type),
        ]);
    }

    /**
     * Create a Wakapi metric
     */
    public function wakapi(): static
    {
        $wakapiTypes = ['coding_minutes', 'active_time', 'keystrokes'];
        $type        = $this->faker->randomElement($wakapiTypes);

        return $this->state(fn (array $attributes) => [
            'type'  => $type,
            'value' => $this->generateValueForType($type),
            'unit'  => $this->getUnitForType($type),
            'meta'  => $this->generateMetaForType($type),
        ]);
    }

    /**
     * Create a Fitbit metric
     */
    public function fitbit(): static
    {
        $fitbitTypes = ['steps', 'calories_burned', 'distance_km'];
        $type        = $this->faker->randomElement($fitbitTypes);

        return $this->state(fn (array $attributes) => [
            'type'  => $type,
            'value' => $this->generateValueForType($type),
            'unit'  => $this->getUnitForType($type),
            'meta'  => $this->generateMetaForType($type),
        ]);
    }

    /**
     * Create metric with specific type
     */
    public function ofType(string $type): static
    {
        return $this->state(fn (array $attributes) => [
            'type'  => $type,
            'value' => $this->generateValueForType($type),
            'unit'  => $this->getUnitForType($type),
            'meta'  => $this->generateMetaForType($type),
        ]);
    }
}
