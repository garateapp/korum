<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\LogsActivity;

class MeetingMinute extends Model
{
    use LogsActivity;
    protected $guarded = [];

    //

public function meeting() {
        return $this->belongsTo(Meeting::class);
    }
    public function decisions() {
        return $this->hasMany(MinuteDecision::class, 'minute_id');
    }
    public function agreements() {
        return $this->hasMany(Agreement::class, 'minute_id');
    }
    public function agreementUpdates() {
        return $this->hasManyThrough(AgreementUpdate::class, Agreement::class, 'minute_id', 'agreement_id');
    }
    public function topics() {
        return $this->hasMany(MinuteTopic::class, 'minute_id');
    }
    public function publisher() {
        return $this->belongsTo(User::class, 'published_by');
    }
}
