<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserFitbitStep extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'steps',
    ];
}
