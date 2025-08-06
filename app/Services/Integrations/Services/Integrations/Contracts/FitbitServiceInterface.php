<?php

namespace App\Services\Integrations\Services\Integrations\Contracts;

use Illuminate\Http\Request;
use App\Dtos\IntegrationTokenDTO;

interface FitbitServiceInterface extends IntegrationInterface
{
    public function storeToken(IntegrationTokenDTO $dto): void;

    public function getRedirectUrl(): string;

    public function handleCallback(Request $request);

    public function getUserSteps(int $userId, ?string $date = null);
}
