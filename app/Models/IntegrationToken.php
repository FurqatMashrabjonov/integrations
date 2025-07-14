<?php

namespace App\Models;

use App\Enums\IntegrationEnum;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $user_id
 * @property IntegrationEnum $integration
 * @property string $access_token
 * @property string|null $refresh_token
 * @property Carbon|null $expires_at
 * @property array<array-key, mixed>|null $meta
 * @property string|null $serialized
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $user
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IntegrationToken newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IntegrationToken newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IntegrationToken query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IntegrationToken whereAccessToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IntegrationToken whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IntegrationToken whereExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IntegrationToken whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IntegrationToken whereIntegration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IntegrationToken whereMeta($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IntegrationToken whereRefreshToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IntegrationToken whereSerialized($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IntegrationToken whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IntegrationToken whereUserId($value)
 *
 * @mixin \Eloquent
 */
class IntegrationToken extends Model
{
    protected $fillable = [
        'user_id',
        'integration',
        'access_token',
        'refresh_token',
        'expires_at',
        'meta',
        'serialized',
    ];

    protected $casts = [
        'expires_at'  => 'datetime',
        'meta'        => 'array',
        'integration' => IntegrationEnum::class,
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
