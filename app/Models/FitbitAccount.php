<?php

namespace App\Models;

use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $user_id
 * @property string|null $display_name
 * @property string|null $full_name
 * @property string|null $avatar
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $user
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FitbitAccount newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FitbitAccount newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FitbitAccount query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FitbitAccount whereAvatar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FitbitAccount whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FitbitAccount whereDisplayName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FitbitAccount whereFullName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FitbitAccount whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FitbitAccount whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FitbitAccount whereUserId($value)
 *
 * @mixin \Eloquent
 */
class FitbitAccount extends Model
{
    protected $fillable = [
        'user_id',
        'display_name',
        'full_name',
        'avatar',
    ];

    /**
     * Get the user that owns the Fitbit account.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
