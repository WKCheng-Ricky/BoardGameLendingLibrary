<?php

use App\Http\Controllers\GameController;
use Illuminate\Support\Facades\Route;

Route::post('/games', [GameController::class, 'store'])->name('games.store');
Route::patch('/games/{game}/status', [GameController::class, 'updateStatus'])->name('games.status.update');
