<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MinuteDecision extends Model
{
    protected $guarded = [];

    public function minute()
    {
        return $this->belongsTo(MeetingMinute::class, 'minute_id');
    }
}
