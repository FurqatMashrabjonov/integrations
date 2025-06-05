<?php

namespace App\Enums;

enum IntegrationEnum: string
{
    case GITHUB = 'github';
    case LEETCODE = 'leetcode';
    case WAKAPI = 'wakapi';
    case FITBIT = 'fitbit';
}
