<?php

namespace App\Http\Integrations\Leetcode\Dtos;

use App\Dtos\BaseDto;

class UserProfileData extends BaseDto
{
    public function __construct(
        public string  $username,
        public ?string $real_name,
        public ?string $user_avatar,
        public string  $ranking,
        public ?array  $badges,
        public int     $ac_submission_num_easy,
        public int     $ac_submission_num_medium,
        public int     $ac_submission_num_hard,
    )
    {
    }
}
