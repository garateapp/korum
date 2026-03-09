<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\LogsActivity;

class Meeting extends Model
{
    use LogsActivity;
    protected $guarded = [];

    //

    
    public function department() {
        return $this->belongsTo(Department::class);
    }

    public function meetingType() {
        return $this->belongsTo(MeetingType::class);
    }

    public function organizer() {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function participants() {
        return $this->hasMany(MeetingParticipant::class);
    }

    public function agendaItems() {
        return $this->hasMany(MeetingAgendaItem::class);
    }

    public function minute() {
        return $this->hasOne(MeetingMinute::class);
    }
    public function attachments() {
        return $this->morphMany(Attachment::class, 'attachable');
    }
}
