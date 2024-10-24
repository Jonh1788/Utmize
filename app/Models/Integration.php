<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Integration extends Model
{
    protected $fillable = [
        'user_id',
        'provider',
        'access_token',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}