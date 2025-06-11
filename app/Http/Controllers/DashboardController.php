<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserFitbitStepsResource;
use App\Models\UserFitbitStep;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function home()
    {
       return Inertia::render('welcome');
    }

    public function dashboard()
    {
        return Inertia::render('dashboard', [
            'steps' =>UserFitbitStepsResource::collection(UserFitbitStep::query()
                ->orderByDesc('date')
                ->limit(7)
                ->where('user_id', auth()->id())->get()),
            'steps_of_today' => number_format(UserFitbitStep::query()->where('user_id', auth()->id())->where('date', Carbon::today()->format('Y-m-d'))->first()?->steps ?? 0),
        ]);
    }
}
