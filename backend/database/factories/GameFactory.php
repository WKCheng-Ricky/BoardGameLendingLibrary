<?php

namespace Database\Factories;

use App\Enums\GameCategory;
use App\Enums\GameStatus;
use App\Models\Game;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Game>
 */
class GameFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => ucwords(fake()->words(3, true)),
            'category' => fake()->randomElement(GameCategory::cases()),
            'status' => GameStatus::Available,
            'created_by' => null,
            'updated_by' => null,
        ];
    }
}
