<?php

namespace App\Http\Integrations\Wakapi\Dtos;

use App\Dtos\BaseDto;

class UserActivities extends BaseDto
{
    public function __construct(
        public string $username,
        public string $started_at,
        public string $ended_at,
        public int $total_seconds,
        public array $editors
    ) {}
}
