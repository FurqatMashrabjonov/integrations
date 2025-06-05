<?php

namespace App\Services\Integrations\Services\Integrations\Contracts;

interface FitbitServiceInterface extends IntegrationInterface
{
    public function storeToken(): void;
}
