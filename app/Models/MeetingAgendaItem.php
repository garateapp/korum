<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MeetingAgendaItem extends Model
{
    protected $guarded = [];

    //

public function meeting() {
        return $this->belongsTo(Meeting::class);
    }
    public function speaker() {
        return $this->belongsTo(User::class, 'speaker_id');
    }
}
