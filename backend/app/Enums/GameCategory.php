<?php

namespace App\Enums;

enum GameCategory: string
{
    case Strategy = 'strategy';
    case Family = 'family';
    case Party = 'party';
    case Kids = 'kids';
}
