<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MeetingParticipant extends Model
{
    protected $guarded = [];

    //

public function meeting() {
        return $this->belongsTo(Meeting::class);
    }
    public function user() {
        return $this->belongsTo(User::class);
    }
}
