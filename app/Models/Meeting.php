<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivity;

class Meeting extends Model
{
    use LogsActivity;

    protected $guarded = [];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function meetingType()
    {
        return $this->belongsTo(MeetingType::class);
    }

    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function participants()
    {
        return $this->hasMany(MeetingParticipant::class);
    }

    public function agendaItems()
    {
        return $this->hasMany(MeetingAgendaItem::class);
    }

    public function minute()
    {
        return $this->hasOne(MeetingMinute::class);
    }

    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    public function scopeVisibleTo(Builder $query, int $userId): Builder
    {
        return $query->where(function (Builder $visibility) use ($userId) {
            $visibility->where('organizer_id', $userId)
                ->orWhereHas('participants', fn (Builder $participants) => $participants->where('user_id', $userId));
        });
    }

    public function isVisibleTo(int $userId): bool
    {
        if ((int) $this->organizer_id === $userId) {
            return true;
        }

        if ($this->relationLoaded('participants')) {
            return $this->participants->contains(fn (MeetingParticipant $participant) => (int) $participant->user_id === $userId);
        }

        return $this->participants()->where('user_id', $userId)->exists();
    }
}
