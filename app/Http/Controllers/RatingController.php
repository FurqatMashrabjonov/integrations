<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    public function index(Request $request)
    {
        $users = collect(range(1, 100))->map(fn ($i) => [
            'name'  => 'User ' . $i,
            'score' => rand(100, 1000),
        ])->toArray();

        return Inertia::render('Rating', [
            'users' => $users,
        ]);
    }
}
