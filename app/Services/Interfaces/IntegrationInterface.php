<?php

namespace App\Services\Interfaces;

use App\Dtos\BaseDto;

interface IntegrationInterface
{

    public function getUser(string $username): BaseDto;

}
