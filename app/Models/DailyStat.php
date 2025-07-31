<?php

namespace App\Models;

use App\Enums\IntegrationEnum;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @property int $id
 * @property int $user_id
 * @property Carbon $date
 * @property string $provider
 * @property array|null $meta
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $user
 * @property-read Collection<int, DailyStatMetric> $metrics
 * @property-read int|null $metrics_count
 *
 * @method static Builder<static>|DailyStat newModelQuery()
 * @method static Builder<static>|DailyStat newQuery()
 * @method static Builder<static>|DailyStat query()
 * @method static Builder<static>|DailyStat whereId($value)
 * @method static Builder<static>|DailyStat whereUserId($value)
 * @method static Builder<static>|DailyStat whereDate($value)
 * @method static Builder<static>|DailyStat whereProvider($value)
 * @method static Builder<static>|DailyStat whereMeta($value)
 * @method static Builder<static>|DailyStat whereCreatedAt($value)
 * @method static Builder<static>|DailyStat whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class DailyStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'provider',
        'meta',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'meta' => 'array',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function metrics(): HasMany
    {
        return $this->hasMany(DailyStatMetric::class);
    }

    public function scopeByUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByProvider(Builder $query, string $provider): Builder
    {
        return $query->where('provider', $provider);
    }

    public function scopeByDate(Builder $query, string $date): Builder
    {
        return $query->whereDate('date', $date);
    }

    public function scopeByDateRange(Builder $query, string $startDate, string $endDate): Builder
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    public function scopeRecent(Builder $query, int $days = 30): Builder
    {
        return $query->where('date', '>=', now()->subDays($days));
    }

    public function scopeWithMetrics(Builder $query): Builder
    {
        return $query->with('metrics');
    }

    /**
     * Get metric value by type
     */
    public function getMetricValue(string $type): ?float
    {
        return $this->metrics->where('type', $type)->first()?->value;
    }

    /**
     * Check if stat has specific metric type
     */
    public function hasMetric(string $type): bool
    {
        return $this->metrics->where('type', $type)->isNotEmpty();
    }

    /**
     * Get all metric values as key-value array
     */
    public function getMetricValues(): array
    {
        return $this->metrics->pluck('value', 'type')->toArray();
    }
}
