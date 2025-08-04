<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class PomodoroController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $currentSession = Cache::get("pomodoro_session_{$userId}");
        $sessions = Cache::get("pomodoro_history_{$userId}", []);
        
        return Inertia::render('Pomodoro/Index', [
            'currentSession' => $currentSession,
            'sessions' => array_reverse($sessions), // Most recent first
        ]);
    }

    public function start(Request $request)
    {
        $request->validate([
            'duration' => 'required|integer|min:1|max:60', // in minutes
            'type' => 'required|string|in:work,short_break,long_break',
            'task' => 'nullable|string|max:255',
        ]);

        $userId = Auth::id();
        $sessionKey = "pomodoro_session_{$userId}";
        
        // Check if there's already an active session
        if (Cache::has($sessionKey)) {
            return response()->json([
                'error' => 'A Pomodoro session is already active'
            ], 400);
        }

        $session = [
            'id' => uniqid(),
            'user_id' => $userId,
            'type' => $request->type,
            'duration' => $request->duration * 60, // Convert to seconds
            'task' => $request->task,
            'started_at' => Carbon::now()->toISOString(),
            'is_active' => true,
        ];

        // Store session for the duration + 5 minutes buffer
        Cache::put($sessionKey, $session, ($request->duration + 5) * 60);

        return response()->json($session);
    }

    public function stop()
    {
        $userId = Auth::id();
        $sessionKey = "pomodoro_session_{$userId}";
        $historyKey = "pomodoro_history_{$userId}";
        
        $session = Cache::get($sessionKey);
        
        if (!$session) {
            return response()->json([
                'error' => 'No active Pomodoro session found'
            ], 400);
        }

        // Calculate actual duration
        $startedAt = Carbon::parse($session['started_at']);
        $actualDuration = Carbon::now()->diffInSeconds($startedAt);
        
        // Mark as completed and add to history
        $session['completed_at'] = Carbon::now()->toISOString();
        $session['actual_duration'] = $actualDuration;
        $session['is_active'] = false;
        $session['completed'] = true;

        // Add to history
        $history = Cache::get($historyKey, []);
        $history[] = $session;
        
        // Keep only last 50 sessions
        if (count($history) > 50) {
            $history = array_slice($history, -50);
        }
        
        Cache::put($historyKey, $history, 60 * 24 * 30); // Keep for 30 days
        
        // Remove active session
        Cache::forget($sessionKey);

        return response()->json($session);
    }

    public function cancel()
    {
        $userId = Auth::id();
        $sessionKey = "pomodoro_session_{$userId}";
        $historyKey = "pomodoro_history_{$userId}";
        
        $session = Cache::get($sessionKey);
        
        if (!$session) {
            return response()->json([
                'error' => 'No active Pomodoro session found'
            ], 400);
        }

        // Calculate actual duration
        $startedAt = Carbon::parse($session['started_at']);
        $actualDuration = Carbon::now()->diffInSeconds($startedAt);
        
        // Mark as cancelled and add to history
        $session['cancelled_at'] = Carbon::now()->toISOString();
        $session['actual_duration'] = $actualDuration;
        $session['is_active'] = false;
        $session['cancelled'] = true;

        // Add to history
        $history = Cache::get($historyKey, []);
        $history[] = $session;
        
        // Keep only last 50 sessions
        if (count($history) > 50) {
            $history = array_slice($history, -50);
        }
        
        Cache::put($historyKey, $history, 60 * 24 * 30); // Keep for 30 days
        
        // Remove active session
        Cache::forget($sessionKey);

        return response()->json($session);
    }

    public function status()
    {
        $userId = Auth::id();
        $session = Cache::get("pomodoro_session_{$userId}");
        
        if (!$session) {
            return response()->json(['active' => false]);
        }

        // Check if session should have expired
        $startedAt = Carbon::parse($session['started_at']);
        $elapsedSeconds = Carbon::now()->diffInSeconds($startedAt);
        
        if ($elapsedSeconds >= $session['duration']) {
            // Session has naturally completed
            $this->stop();
            return response()->json(['active' => false, 'naturally_completed' => true]);
        }

        $session['elapsed_seconds'] = $elapsedSeconds;
        $session['remaining_seconds'] = $session['duration'] - $elapsedSeconds;
        
        return response()->json($session);
    }

    public function history()
    {
        $userId = Auth::id();
        $sessions = Cache::get("pomodoro_history_{$userId}", []);
        
        return response()->json(array_reverse($sessions)); // Most recent first
    }
}
