<?php

namespace App\Http\Controllers;

use App\Models\DailyStat;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DailyStatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = DailyStat::with('metrics');

        // Filter by user
        if ($request->has('user_id')) {
            $query->byUser($request->user_id);
        }

        // Filter by provider
        if ($request->has('provider')) {
            $query->byProvider($request->provider);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->byDateRange($request->start_date, $request->end_date);
        } elseif ($request->has('date')) {
            $query->byDate($request->date);
        }

        // Filter by recent days
        if ($request->has('recent_days')) {
            $query->recent($request->recent_days);
        }

        // Sorting
        $sortBy    = $request->get('sort_by', 'date');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage    = $request->get('per_page', 15);
        $dailyStats = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data'    => $dailyStats,
            'message' => 'Daily stats retrieved successfully',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(DailyStat $dailyStat): JsonResponse
    {
        $dailyStat->load('metrics', 'user');

        return response()->json([
            'success' => true,
            'data'    => $dailyStat,
            'message' => 'Daily stat retrieved successfully',
        ]);
    }

    /**
     * Get aggregated stats for a user
     */
    public function aggregated(Request $request): JsonResponse
    {
        $request->validate([
            'user_id'     => 'required|integer|exists:users,id',
            'provider'    => 'sometimes|string|in:github,leetcode,wakapi,fitbit',
            'start_date'  => 'sometimes|date',
            'end_date'    => 'sometimes|date',
            'metric_type' => 'sometimes|string',
        ]);

        $query = DailyStat::with('metrics')
            ->byUser($request->user_id);

        if ($request->has('provider')) {
            $query->byProvider($request->provider);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->byDateRange($request->start_date, $request->end_date);
        }

        $dailyStats = $query->get();

        // Aggregate metrics
        $aggregated = [];
        foreach ($dailyStats as $stat) {
            foreach ($stat->metrics as $metric) {
                if ($request->has('metric_type') && $metric->type !== $request->metric_type) {
                    continue;
                }

                if (!isset($aggregated[$metric->type])) {
                    $aggregated[$metric->type] = [
                        'total'   => 0,
                        'count'   => 0,
                        'average' => 0,
                        'unit'    => $metric->unit,
                        'values'  => [],
                    ];
                }

                $aggregated[$metric->type]['total'] += $metric->value;
                $aggregated[$metric->type]['count']++;
                $aggregated[$metric->type]['values'][] = [
                    'value' => $metric->value,
                    'date'  => $stat->date->format('Y-m-d'),
                ];
            }
        }

        // Calculate averages
        foreach ($aggregated as $type => &$data) {
            $data['average'] = $data['count'] > 0 ? $data['total'] / $data['count'] : 0;
        }

        return response()->json([
            'success' => true,
            'data'    => $aggregated,
            'message' => 'Aggregated stats retrieved successfully',
        ]);
    }
}
