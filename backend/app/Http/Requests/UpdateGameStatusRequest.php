<?php

namespace App\Http\Requests;

use App\Enums\GameStatus;
use App\Models\Game;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGameStatusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(GameStatus::class)],
        ];
    }

    /**
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $target = GameStatus::tryFrom((string) $this->input('status'));

                if ($target === null) {
                    return;
                }

                /** @var Game $game */
                $game = $this->route('game');

                if (! $game->status->canTransitionTo($target)) {
                    $validator->errors()->add(
                        'status',
                        "Cannot transition game from '{$game->status->value}' to '{$target->value}'.",
                    );
                }
            },
        ];
    }
}
