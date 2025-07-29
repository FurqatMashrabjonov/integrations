<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeetcodeProfile extends Model
{
    protected $fillable = [
        'leetcode_id',
        'username',
        'profile',
        'recent',
        'last_synced_at',
    ];

    protected $casts = [
        'profile'        => 'array',
        'recent'         => 'array',
        'last_synced_at' => 'datetime',
    ];

    public function leetcode()
    {
        return $this->belongsTo(Leetcode::class);
    }
}
