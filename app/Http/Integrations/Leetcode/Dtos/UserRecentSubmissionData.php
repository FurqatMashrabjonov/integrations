<?php

namespace App\Http\Integrations\Leetcode\Dtos;

use App\Dtos\BaseDto;

class UserRecentSubmissionData extends BaseDto
{
    public function __construct(
        public string $title,
        public string $title_slug,
        public int $timestamp,
        public string $status_display,
        public string $lang,
    ) {}
}
