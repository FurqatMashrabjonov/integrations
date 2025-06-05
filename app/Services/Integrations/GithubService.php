<?php

namespace App\Services\Integrations;

use App\Dtos\BaseDto;
use App\Services\Integrations\Services\Integrations\Contracts\GithubServiceInterface;

class GithubService implements GithubServiceInterface
{

    public function getUser(string $username): BaseDto
    {

    }
}
