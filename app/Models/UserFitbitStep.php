<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $user_id
 * @property string $date
 * @property int $steps
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserFitbitStep newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserFitbitStep newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserFitbitStep query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserFitbitStep whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserFitbitStep whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserFitbitStep whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserFitbitStep whereSteps($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserFitbitStep whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserFitbitStep whereUserId($value)
 *
 * @mixin \Eloquent
 */
class UserFitbitStep extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'steps',
    ];
}
