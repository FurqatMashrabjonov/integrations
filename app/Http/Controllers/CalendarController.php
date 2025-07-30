<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CalendarController extends Controller
{
    public function index(Request $request)
    {
        $events = [
            ['date' => now()->toDateString(), 'title' => 'Meeting with Team'],
            ['date' => now()->addDay()->toDateString(), 'title' => 'Project Deadline'],
            ['date' => now()->addDays(3)->toDateString(), 'title' => 'Client Call'],
        ];

        return Inertia::render('Calendar', [
            'events' => $events,
        ]);
    }
}
