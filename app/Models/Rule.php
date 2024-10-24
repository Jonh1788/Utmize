<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
class Rule extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'product',
        'ad_accounts',
        'apply_to',
        'condition',
        'action',
        'period',
        'frequency',
        'fb_rule_id',
        'status', 
    ];

    protected $casts = [
        'condition' => 'array',
        'fb_rule_ids' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}