<?php

namespace App\Http\Integrations\Wakapi\Dtos;

use App\Dtos\BaseDto;

final class UserProfileData extends BaseDto
{
    public function __construct(
        public string $username,
        public string $email,
        public string $photo,
        public string $display_name
    ) {}
}
