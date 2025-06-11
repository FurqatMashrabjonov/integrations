<?php

namespace App\Services\Integrations\Services\Integrations\Contracts;

use App\Dtos\BaseDto;
use Illuminate\Http\Request;

interface FitbitServiceInterface extends IntegrationInterface
{
    public function storeToken(BaseDto $dto): void;

    public function getRedirectUrl(): string;

    public function handleCallback(Request $request);

    public function getUserStepsAndStore(int $userId, ?string $date = null);
}
