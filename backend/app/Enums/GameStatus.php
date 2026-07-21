<?php

namespace App\Enums;

enum GameStatus: string
{
    case Available = 'available';
    case Reserved = 'reserved';
    case OnLoan = 'on_loan';
    case Retired = 'retired';
}
