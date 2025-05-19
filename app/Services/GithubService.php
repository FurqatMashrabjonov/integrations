<?php

namespace App\Services;

use App\Dtos\BaseDto;
use App\Services\Interfaces\GithubServiceInterface;

class GithubService implements GithubServiceInterface
{

    public function getUser(string $username): BaseDto
    {

    }
}
