<?php

namespace App\Models;

use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @property int $id
 * @property int $daily_stat_id
 * @property string $type
 * @property float $value
 * @property string|null $unit
 * @property array|null $meta
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read DailyStat $dailyStat
 *
 * @method static Builder<static>|DailyStatMetric newModelQuery()
 * @method static Builder<static>|DailyStatMetric newQuery()
 * @method static Builder<static>|DailyStatMetric query()
 * @method static Builder<static>|DailyStatMetric whereId($value)
 * @method static Builder<static>|DailyStatMetric whereDailyStatId($value)
 * @method static Builder<static>|DailyStatMetric whereType($value)
 * @method static Builder<static>|DailyStatMetric whereValue($value)
 * @method static Builder<static>|DailyStatMetric whereUnit($value)
 * @method static Builder<static>|DailyStatMetric whereMeta($value)
 * @method static Builder<static>|DailyStatMetric whereCreatedAt($value)
 * @method static Builder<static>|DailyStatMetric whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class DailyStatMetric extends Model
{
    use HasFactory;

    protected $fillable = [
        'daily_stat_id',
        'type',
        'value',
        'unit',
        'meta',
    ];

    protected function casts(): array
    {
        return [
            'value'      => 'float',
            'meta'       => 'array',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function dailyStat(): BelongsTo
    {
        return $this->belongsTo(DailyStat::class);
    }

    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    public function scopeByUnit(Builder $query, string $unit): Builder
    {
        return $query->where('unit', $unit);
    }

    public function scopeByValueRange(Builder $query, float $min, float $max): Builder
    {
        return $query->whereBetween('value', [$min, $max]);
    }

    public function scopeOrderByValue(Builder $query, string $direction = 'asc'): Builder
    {
        return $query->orderBy('value', $direction);
    }

    /**
     * Get formatted value with unit
     */
    public function getFormattedValueAttribute(): string
    {
        $value = number_format($this->value, 2);

        return $this->unit ? "$value {$this->unit}" : $value;
    }

    /**
     * Check if metric has meta data
     */
    public function hasMeta(): bool
    {
        return !empty($this->meta);
    }

    /**
     * Get meta value by key
     */
    public function getMetaValue(string $key): mixed
    {
        return $this->meta[$key] ?? null;
    }
}
