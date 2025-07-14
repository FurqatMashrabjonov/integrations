<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
