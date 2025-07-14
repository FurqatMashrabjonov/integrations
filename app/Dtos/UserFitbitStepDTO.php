<?php

namespace App\Dtos;

class UserFitbitStepDTO extends BaseDto
{
    public function __construct(
        public int $user_id = 0,
        public ?string $date = null,
        public ?int $steps = null,
    ) {}
}
