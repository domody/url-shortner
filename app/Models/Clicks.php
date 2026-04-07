<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Clicks extends Model
{
    protected $fillable = [
        'link_id',
        'ip_address',
        'referrer',
        'user_agent',
    ];
}
