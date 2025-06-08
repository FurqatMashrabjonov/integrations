<?php

namespace App\Models;

use App\Enums\IntegrationEnum;
use Illuminate\Database\Eloquent\Model;

class IntegrationToken extends Model
{
    protected $fillable = [
        'user_id',
        'integration',
        'access_token',
        'refresh_token',
        'expires_at',
        'meta',
        'serialized'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'meta' => 'array',
        'integration' => IntegrationEnum::class
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
