<?php

namespace App\Services\Integrations\Services\Integrations\Contracts;

use App\Dtos\BaseDto;
use App\Dtos\IntegrationTokenDTO;
use Illuminate\Http\Request;

interface FitbitServiceInterface extends IntegrationInterface
{
    public function storeToken(IntegrationTokenDTO $dto): void;

    public function getRedirectUrl(): string;

    public function handleCallback(Request $request);

    public function getUserStepsAndStore(int $userId, ?string $date = null);
}
