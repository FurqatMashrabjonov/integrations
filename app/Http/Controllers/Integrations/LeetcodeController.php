<?php

namespace App\Http\Controllers\Integrations;

use App\Http\Controllers\Controller;
use App\Services\Integrations\Services\Integrations\Contracts\LeetcodeServiceInterface;

class LeetcodeController extends Controller
{
    public function __construct(public readonly LeetcodeServiceInterface $service) {}

    public function store() {}

    public function exists() {}

    public function destroy() {}

    public function show() {}
}
