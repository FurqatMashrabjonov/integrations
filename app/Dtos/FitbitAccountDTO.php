<?php

namespace App\Dtos;

use App\Enums\IntegrationEnum;

class FitbitAccountDTO extends BaseDto
{
    public function __construct(
        public int  $user_id = 0,
        public ?string $display_name = null,
        public ?string $full_name = null,
        public ?string $avatar = null,
    )
    {
    }
}
