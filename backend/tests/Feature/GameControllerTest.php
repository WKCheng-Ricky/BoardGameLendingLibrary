<?php

namespace Tests\Feature;

use App\Enums\GameCategory;
use App\Enums\GameStatus;
use App\Models\Game;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GameControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_a_game_with_valid_title_and_category(): void
    {
        $response = $this->postJson('/api/games', [
            'title' => 'Catan',
            'category' => GameCategory::Strategy->value,
        ]);

        $response->assertCreated();
        $response->assertJsonPath('data.status', GameStatus::Available->value);

        $this->assertDatabaseHas('games', [
            'title' => 'Catan',
            'category' => GameCategory::Strategy->value,
            'status' => GameStatus::Available->value,
        ]);
    }

    public function test_it_rejects_blank_title_on_create(): void
    {
        $response = $this->postJson('/api/games', [
            'title' => '',
            'category' => GameCategory::Strategy->value,
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['title']);
    }

    public function test_it_rejects_missing_title_on_create(): void
    {
        $response = $this->postJson('/api/games', [
            'category' => GameCategory::Strategy->value,
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['title']);
    }

    public function test_it_rejects_missing_category_on_create(): void
    {
        $response = $this->postJson('/api/games', [
            'title' => 'Catan',
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['category']);
    }

    public function test_it_rejects_invalid_category_on_create(): void
    {
        $response = $this->postJson('/api/games', [
            'title' => 'Catan',
            'category' => 'nonsense',
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['category']);
    }

    public function test_it_ignores_client_supplied_status_on_create(): void
    {
        $response = $this->postJson('/api/games', [
            'title' => 'Catan',
            'category' => GameCategory::Strategy->value,
            'status' => GameStatus::Retired->value,
        ]);

        $response->assertCreated();

        $this->assertDatabaseHas('games', [
            'title' => 'Catan',
            'status' => GameStatus::Available->value,
        ]);
    }

    public function test_it_does_not_persist_created_by_or_updated_by_from_request(): void
    {
        $response = $this->postJson('/api/games', [
            'title' => 'Catan',
            'category' => GameCategory::Strategy->value,
            'created_by' => 1,
            'updated_by' => 1,
        ]);

        $response->assertCreated();

        $this->assertDatabaseHas('games', [
            'title' => 'Catan',
            'created_by' => null,
            'updated_by' => null,
        ]);
    }

    public function test_available_can_transition_to_reserved(): void
    {
        $this->assertTransitionSucceeds(GameStatus::Available, GameStatus::Reserved);
    }

    public function test_reserved_can_transition_to_on_loan(): void
    {
        $this->assertTransitionSucceeds(GameStatus::Reserved, GameStatus::OnLoan);
    }

    public function test_on_loan_can_transition_to_available(): void
    {
        $this->assertTransitionSucceeds(GameStatus::OnLoan, GameStatus::Available);
    }

    public function test_available_can_transition_to_retired(): void
    {
        $this->assertTransitionSucceeds(GameStatus::Available, GameStatus::Retired);
    }

    public function test_reserved_can_transition_to_retired(): void
    {
        $this->assertTransitionSucceeds(GameStatus::Reserved, GameStatus::Retired);
    }

    public function test_on_loan_can_transition_to_retired(): void
    {
        $this->assertTransitionSucceeds(GameStatus::OnLoan, GameStatus::Retired);
    }

    public function test_available_cannot_transition_directly_to_on_loan(): void
    {
        $this->assertTransitionRejected(GameStatus::Available, GameStatus::OnLoan);
    }

    public function test_reserved_cannot_transition_directly_to_available(): void
    {
        $this->assertTransitionRejected(GameStatus::Reserved, GameStatus::Available);
    }

    public function test_on_loan_cannot_transition_directly_to_reserved(): void
    {
        $this->assertTransitionRejected(GameStatus::OnLoan, GameStatus::Reserved);
    }

    public function test_retired_game_rejects_transition_to_available(): void
    {
        $this->assertTransitionRejected(GameStatus::Retired, GameStatus::Available);
    }

    public function test_retired_game_rejects_transition_to_reserved(): void
    {
        $this->assertTransitionRejected(GameStatus::Retired, GameStatus::Reserved);
    }

    public function test_retired_game_rejects_transition_to_on_loan(): void
    {
        $this->assertTransitionRejected(GameStatus::Retired, GameStatus::OnLoan);
    }

    public function test_retired_game_rejects_transition_to_retired(): void
    {
        $this->assertTransitionRejected(GameStatus::Retired, GameStatus::Retired);
    }

    public function test_update_status_requires_status_field(): void
    {
        $game = Game::factory()->create(['status' => GameStatus::Available]);

        $response = $this->patchJson("/api/games/{$game->id}/status", []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['status']);
    }

    public function test_update_status_rejects_invalid_enum_value(): void
    {
        $game = Game::factory()->create(['status' => GameStatus::Available]);

        $response = $this->patchJson("/api/games/{$game->id}/status", ['status' => 'bogus']);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['status']);
    }

    public function test_update_status_returns_404_for_nonexistent_game(): void
    {
        $response = $this->patchJson('/api/games/999999/status', ['status' => GameStatus::Reserved->value]);

        $response->assertNotFound();
    }

    public function test_update_status_does_not_change_title_or_category(): void
    {
        $game = Game::factory()->create([
            'title' => 'Original Title',
            'category' => GameCategory::Strategy,
            'status' => GameStatus::Available,
        ]);

        $response = $this->patchJson("/api/games/{$game->id}/status", [
            'title' => 'Hacked Title',
            'category' => GameCategory::Party->value,
            'status' => GameStatus::Reserved->value,
        ]);

        $response->assertOk();

        $this->assertDatabaseHas('games', [
            'id' => $game->id,
            'title' => 'Original Title',
            'category' => GameCategory::Strategy->value,
            'status' => GameStatus::Reserved->value,
        ]);
    }

    private function assertTransitionSucceeds(GameStatus $from, GameStatus $to): void
    {
        $game = Game::factory()->create(['status' => $from]);

        $response = $this->patchJson("/api/games/{$game->id}/status", ['status' => $to->value]);

        $response->assertOk();
        $response->assertJsonPath('data.status', $to->value);

        $this->assertDatabaseHas('games', ['id' => $game->id, 'status' => $to->value]);
    }

    private function assertTransitionRejected(GameStatus $from, GameStatus $to): void
    {
        $game = Game::factory()->create(['status' => $from]);

        $response = $this->patchJson("/api/games/{$game->id}/status", ['status' => $to->value]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['status']);

        $this->assertDatabaseHas('games', ['id' => $game->id, 'status' => $from->value]);
    }
}
