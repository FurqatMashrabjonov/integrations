<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DailyStatMetric;
use Illuminate\Http\JsonResponse;

class DailyStatMetricController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = DailyStatMetric::with('dailyStat');

        // Filter by daily stat ID
        if ($request->has('daily_stat_id')) {
            $query->where('daily_stat_id', $request->daily_stat_id);
        }

        // Filter by metric type
        if ($request->has('type')) {
            $query->byType($request->type);
        }

        // Filter by unit
        if ($request->has('unit')) {
            $query->byUnit($request->unit);
        }

        // Filter by value range
        if ($request->has('min_value') && $request->has('max_value')) {
            $query->byValueRange($request->min_value, $request->max_value);
        }

        // Sorting
        $sortBy    = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $metrics = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data'    => $metrics,
            'message' => 'Daily stat metrics retrieved successfully',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(DailyStatMetric $dailyStatMetric): JsonResponse
    {
        $dailyStatMetric->load('dailyStat');

        return response()->json([
            'success' => true,
            'data'    => $dailyStatMetric,
            'message' => 'Daily stat metric retrieved successfully',
        ]);
    }

    /**
     * Get metrics grouped by type for analysis
     */
    public function byType(Request $request): JsonResponse
    {
        $request->validate([
            'daily_stat_id' => 'sometimes|integer|exists:daily_stats,id',
            'start_date'    => 'sometimes|date',
            'end_date'      => 'sometimes|date',
        ]);

        $query = DailyStatMetric::with('dailyStat');

        if ($request->has('daily_stat_id')) {
            $query->where('daily_stat_id', $request->daily_stat_id);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereHas('dailyStat', function ($q) use ($request) {
                $q->whereBetween('date', [$request->start_date, $request->end_date]);
            });
        }

        $metrics = $query->get();

        $groupedByType = $metrics->groupBy('type')->map(function ($typeMetrics) {
            return [
                'count'   => $typeMetrics->count(),
                'total'   => $typeMetrics->sum('value'),
                'average' => $typeMetrics->avg('value'),
                'min'     => $typeMetrics->min('value'),
                'max'     => $typeMetrics->max('value'),
                'unit'    => $typeMetrics->first()->unit,
                'metrics' => $typeMetrics->values(),
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $groupedByType,
            'message' => 'Metrics grouped by type retrieved successfully',
        ]);
    }
}
