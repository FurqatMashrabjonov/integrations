<?php

namespace App\Http\Integrations\Wakapi\Dtos;

use App\Dtos\BaseDto;

class UserActivities extends BaseDto
{
    public function __construct(
        public string $username,
        public array $data,
        public array $languages = [],
        public array $projects = [],
        public array $editors = [],
        public array $operating_systems = [],
        public int $total_seconds = 0
    ) {}
}
