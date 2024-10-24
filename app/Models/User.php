<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Rule;
use App\Models\Integration;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            $user->referral_code = self::generateReferralCode();
        });
    }

    public function rules()
    {
        return $this->hasMany(Rule::class);
    }

    private static function generateReferralCode()
    {
        do {
            $code = strtoupper(bin2hex(random_bytes(5)));
        } while (self::where('referral_code', $code)->exists());

        return $code;
    }

    public function sales()
{
    return $this->hasMany(Sale::class);
}

 public function integrations(){
    return $this->hasMany(Integration::class);
 }
}
