<?php

namespace App\Dtos;

use App\Enums\IntegrationEnum;

class IntegrationTokenDTO extends BaseDto
{
    public function __construct(
        public int  $user_id = 0,
        public ?string $access_token = null,
        public ?string $refresh_token = null,
        public ?string $expires_at = null,
        public IntegrationEnum  $integration,
        public ?string $serialized = null,
        public ?array $meta = null,
    )
    {
    }
}
