<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read User|null $user
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wakapi newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wakapi newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wakapi query()
 *
 * @mixin \Eloquent
 */
class Wakapi extends Model
{
    protected $fillable = [
        'user_id',
        'api_key',
    ];

    /**
     * Get the user that owns the Wakapi account.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
