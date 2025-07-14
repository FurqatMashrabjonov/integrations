<?php

namespace App\Services\Integrations\Contracts;

use App\Dtos\BaseDto;
use Illuminate\Http\Request;

interface WakapiServiceInterface extends IntegrationInterface
{
    public function storeToken(BaseDto $dto): void;

    public function getRedirectUrl(): string;

    public function handleCallback(Request $request);
}
