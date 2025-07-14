<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\UserFitbitStep;
use App\Http\Resources\UserFitbitStepsResource;

class DashboardController extends Controller
{
    public function home()
    {
        return Inertia::render('welcome');
    }

    public function dashboard()
    {
        $steps = UserFitbitStep::query()
            ->select('steps', 'date', 'id', 'user_id')
            ->where('user_id', auth()->id())
            ->orderByDesc('date')
            ->take(7)
            ->get()->reverse();

        return Inertia::render('dashboard', [
            'steps'          => UserFitbitStepsResource::collection($steps)->resolve(),
            'steps_of_today' => number_format(UserFitbitStep::query()->where('user_id', auth()->id())->where('date', Carbon::today()->format('Y-m-d'))->first()?->steps ?? 0),
        ]);
    }
}
