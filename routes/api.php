<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DailyStatController;
use App\Http\Controllers\DailyStatMetricController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Daily Stats Read-Only API Routes
Route::get('daily-stats', [DailyStatController::class, 'index']);
Route::get('daily-stats/{dailyStat}', [DailyStatController::class, 'show']);
Route::get('daily-stats-aggregated', [DailyStatController::class, 'aggregated']);

// Daily Stat Metrics Read-Only API Routes
Route::get('daily-stat-metrics', [DailyStatMetricController::class, 'index']);
Route::get('daily-stat-metrics/{dailyStatMetric}', [DailyStatMetricController::class, 'show']);
Route::get('daily-stat-metrics-by-type', [DailyStatMetricController::class, 'byType']);
