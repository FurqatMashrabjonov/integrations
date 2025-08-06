<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class WakapiService
{
    protected string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.wakapi.base_url', 'https://wakapi.dev');
    }

    /**
     * Validate API token by making a test request
     */
    public function validateApiToken(string $apiToken): bool
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiToken,
                'Accept'        => 'application/json',
            ])->timeout(10)->get($this->baseUrl . '/api/summary');

            return $response->successful();
        } catch (Exception $e) {
            Log::error('Wakapi API token validation failed', [
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Get user profile information
     */
    public function getUserProfile(string $apiToken): ?array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiToken,
                'Accept'        => 'application/json',
            ])->timeout(10)->get($this->baseUrl . '/api/summary');

            if ($response->successful()) {
                $data = $response->json();

                return [
                    'username'     => $data['user'] ?? 'Unknown',
                    'display_name' => $data['user'] ?? 'Unknown',
                    'full_name'    => $data['user'] ?? null,
                ];
            }

            return null;
        } catch (Exception $e) {
            Log::error('Failed to get Wakapi user profile', [
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Get daily activity (today's stats)
     */
    public function getDailyActivity(string $apiToken): array
    {
        try {
            $today = now()->format('Y-m-d');

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiToken,
                'Accept'        => 'application/json',
            ])->timeout(15)->get($this->baseUrl . '/api/summary', [
                'start' => $today,
                'end'   => $today,
            ]);

            if ($response->successful()) {
                $data = $response->json();

                return [
                    'total_seconds' => $data['cumulative_total']['total_seconds'] ?? 0,
                    'languages'     => $this->formatLanguages($data['languages'] ?? []),
                    'projects'      => $this->formatProjects($data['projects'] ?? []),
                ];
            }

            return [
                'total_seconds' => 0,
                'languages'     => [],
                'projects'      => [],
            ];
        } catch (Exception $e) {
            Log::error('Failed to get Wakapi daily activity', [
                'error' => $e->getMessage(),
            ]);

            return [
                'total_seconds' => 0,
                'languages'     => [],
                'projects'      => [],
            ];
        }
    }

    /**
     * Get weekly activity stats
     */
    public function getWeeklyActivity(string $apiToken): array
    {
        try {
            $startOfWeek = now()->startOfWeek()->format('Y-m-d');
            $endOfWeek   = now()->endOfWeek()->format('Y-m-d');

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiToken,
                'Accept'        => 'application/json',
            ])->timeout(15)->get($this->baseUrl . '/api/summary', [
                'start' => $startOfWeek,
                'end'   => $endOfWeek,
            ]);

            if ($response->successful()) {
                $data = $response->json();

                return [
                    'total_seconds' => $data['cumulative_total']['total_seconds'] ?? 0,
                    'languages'     => $this->formatLanguages($data['languages'] ?? []),
                    'projects'      => $this->formatProjects($data['projects'] ?? []),
                ];
            }

            return [
                'total_seconds' => 0,
                'languages'     => [],
                'projects'      => [],
            ];
        } catch (Exception $e) {
            Log::error('Failed to get Wakapi weekly activity', [
                'error' => $e->getMessage(),
            ]);

            return [
                'total_seconds' => 0,
                'languages'     => [],
                'projects'      => [],
            ];
        }
    }

    /**
     * Format languages data
     */
    private function formatLanguages(array $languages): array
    {
        return collect($languages)->map(function ($lang) {
            return [
                'name'          => $lang['name'] ?? 'Unknown',
                'total_seconds' => $lang['total_seconds'] ?? 0,
                'percent'       => $lang['percent'] ?? 0,
            ];
        })->toArray();
    }

    /**
     * Format projects data
     */
    private function formatProjects(array $projects): array
    {
        return collect($projects)->map(function ($project) {
            return [
                'name'          => $project['name'] ?? 'Unknown',
                'total_seconds' => $project['total_seconds'] ?? 0,
                'percent'       => $project['percent'] ?? 0,
            ];
        })->toArray();
    }
}
