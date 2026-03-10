<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

use App\Traits\LogsActivity;

class Agreement extends Model
{
    use LogsActivity;
    protected $table = 'minute_agreements';
    protected $guarded = [];

    public function minute() {
        return $this->belongsTo(MeetingMinute::class, 'minute_id');
    }
    public function responsible() {
        return $this->belongsTo(User::class, 'responsible_id');
    }
    public function responsibles() {
        return $this->belongsToMany(User::class, 'agreement_user', 'agreement_id', 'user_id')->withTimestamps();
    }
    public function department() {
        return $this->belongsTo(Department::class);
    }
    public function updates() {
        return $this->hasMany(AgreementUpdate::class, 'agreement_id');
    }
    public function attachments() {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    public function scopeVisibleTo(Builder $query, int $userId): Builder
    {
        return $query->whereHas('minute.meeting', function (Builder $meetingQuery) use ($userId) {
            $meetingQuery->visibleTo($userId);
        });
    }

    public function isVisibleTo(int $userId): bool
    {
        return static::query()
            ->whereKey($this->id)
            ->visibleTo($userId)
            ->exists();
    }
}
