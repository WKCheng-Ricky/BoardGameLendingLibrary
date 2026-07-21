<?php

namespace App\Http\Controllers;

use App\Enums\GameStatus;
use App\Http\Requests\IndexGameRequest;
use App\Http\Requests\StoreGameRequest;
use App\Http\Requests\UpdateGameStatusRequest;
use App\Models\Game;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class GameController extends Controller
{
    public function index(IndexGameRequest $request): JsonResponse
    {
        $games = Game::query()
            ->where('status', $request->validated('status'))
            ->get();

        return response()->json(['data' => $games]);
    }

    public function store(StoreGameRequest $request): JsonResponse
    {
        $game = Game::create([
            ...$request->validated(),
            'status' => GameStatus::Available,
        ]);

        return response()->json(['data' => $game], Response::HTTP_CREATED);
    }

    public function updateStatus(UpdateGameStatusRequest $request, Game $game): JsonResponse
    {
        $game->update(['status' => GameStatus::from($request->validated('status'))]);

        return response()->json(['data' => $game]);
    }
}
