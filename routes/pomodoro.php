<?php

use App\Http\Controllers\PomodoroController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/pomodoro', [PomodoroController::class, 'index'])->name('pomodoro');
    Route::post('/pomodoro/start', [PomodoroController::class, 'start'])->name('pomodoro.start');
    Route::post('/pomodoro/stop', [PomodoroController::class, 'stop'])->name('pomodoro.stop');
    Route::post('/pomodoro/cancel', [PomodoroController::class, 'cancel'])->name('pomodoro.cancel');
    Route::get('/pomodoro/status', [PomodoroController::class, 'status'])->name('pomodoro.status');
    Route::get('/pomodoro/history', [PomodoroController::class, 'history'])->name('pomodoro.history');
});
