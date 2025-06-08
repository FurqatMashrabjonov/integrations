<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
