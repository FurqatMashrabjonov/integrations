<?php

namespace App\Models;

use App\Enums\IntegrationEnum;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @property int $id
 * @property int $user_id
 * @property string|null $display_name
 * @property string|null $full_name
 * @property string|null $avatar
 * @property IntegrationEnum $integration
 * @property array $data
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $user
 *
 * @method static Builder<static>|IntegrationAccount newModelQuery()
 * @method static Builder<static>|IntegrationAccount newQuery()
 * @method static Builder<static>|IntegrationAccount query()
 * @method static Builder<static>|IntegrationAccount whereId($value)
 * @method static Builder<static>|IntegrationAccount whereUserId($value)
 * @method static Builder<static>|IntegrationAccount whereDisplayName($value)
 * @method static Builder<static>|IntegrationAccount whereFullName($value)
 * @method static Builder<static>|IntegrationAccount whereAvatar($value)
 * @method static Builder<static>|IntegrationAccount whereIntegration($value)
 * @method static Builder<static>|IntegrationAccount whereData($value)
 * @method static Builder<static>|IntegrationAccount whereCreatedAt($value)
 * @method static Builder<static>|IntegrationAccount whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class IntegrationAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'display_name',
        'full_name',
        'avatar',
        'integration',
        'data',
    ];

    protected function casts(): array
    {
        return [
            'integration' => IntegrationEnum::class,
            'data'        => 'array',
            'created_at'  => 'datetime',
            'updated_at'  => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeByIntegration(Builder $query, IntegrationEnum $integration): Builder
    {
        return $query->where('integration', $integration);
    }

    public function scopeByUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }
}
