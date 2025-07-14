<?php

namespace App\Dtos;

use Spatie\LaravelData\Data;

class TokenDto extends Data
{
    public ?string $access_token;
    public ?string $refresh_token;
    public ?string $expires_in;
}
