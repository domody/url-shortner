<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Clicks extends Model
{
    use HasFactory;

    protected $fillable = [
        'link_id',
        'ip_address',
        'referrer',
        'user_agent',
    ];

    public function link()
    {
        return $this->belongsTo(Links::class);
    }
}
