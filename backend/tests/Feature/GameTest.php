<?php

namespace Tests\Feature;

use App\Enums\GameCategory;
use App\Enums\GameStatus;
use App\Models\Game;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class GameTest extends TestCase
{
    use RefreshDatabase;

    public function test_games_table_has_expected_columns(): void
    {
        $this->assertTrue(Schema::hasColumns('games', [
            'id',
            'title',
            'category',
            'status',
            'created_by',
            'updated_by',
            'created_at',
            'updated_at',
        ]));
    }

    public function test_status_defaults_to_available_when_not_specified(): void
    {
        $id = DB::table('games')->insertGetId([
            'title' => 'Catan',
            'category' => GameCategory::Strategy->value,
        ]);

        $this->assertDatabaseHas('games', [
            'id' => $id,
            'status' => GameStatus::Available->value,
        ]);
    }

    public function test_updated_at_auto_updates_on_raw_database_update(): void
    {
        $id = DB::table('games')->insertGetId([
            'title' => 'Original Title',
            'category' => GameCategory::Strategy->value,
        ]);

        $this->assertDatabaseHas('games', ['id' => $id, 'updated_at' => null]);

        DB::table('games')->where('id', $id)->update(['title' => 'Updated Title']);

        $updatedAt = DB::table('games')->where('id', $id)->value('updated_at');

        $this->assertNotNull($updatedAt);
    }

    public function test_game_casts_category_and_status_to_enums(): void
    {
        $game = Game::factory()->create([
            'category' => GameCategory::Strategy,
            'status' => GameStatus::OnLoan,
        ]);

        $fresh = Game::find($game->id);

        $this->assertInstanceOf(GameCategory::class, $fresh->category);
        $this->assertSame(GameCategory::Strategy, $fresh->category);
        $this->assertInstanceOf(GameStatus::class, $fresh->status);
        $this->assertSame(GameStatus::OnLoan, $fresh->status);
    }
}
