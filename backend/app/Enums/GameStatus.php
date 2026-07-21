<?php

namespace App\Enums;

enum GameStatus: string
{
    case Available = 'available';
    case Reserved = 'reserved';
    case OnLoan = 'on_loan';
    case Retired = 'retired';

    /**
     * The statuses this status is allowed to transition to.
     *
     * @return array<int, self>
     */
    public function allowedTransitions(): array
    {
        return match ($this) {
            self::Available => [self::Reserved, self::Retired],
            self::Reserved => [self::OnLoan, self::Retired],
            self::OnLoan => [self::Available, self::Retired],
            self::Retired => [],
        };
    }

    public function canTransitionTo(self $target): bool
    {
        return in_array($target, $this->allowedTransitions(), true);
    }
}
