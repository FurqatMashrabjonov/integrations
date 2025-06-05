<?php

namespace App\Services\Integrations;

use App\Dtos\BaseDto;
use App\Services\Integrations\Services\Integrations\Contracts\FitbitServiceInterface;
use App\Services\Integrations\Services\Integrations\Contracts\GithubServiceInterface;

class FitbitService implements FitbitServiceInterface
{



    public function getUser(string $username): BaseDto
    {

    }
}
