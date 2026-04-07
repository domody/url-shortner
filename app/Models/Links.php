<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Links extends Model
{
    protected $fillable = [
        'user_id',
        'original_url',
        'code'
    ];
}
