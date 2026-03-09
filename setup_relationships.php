<?php

$models = [
    'Meeting.php' => "
    public function organizer() {
        return \$this->belongsTo(User::class, 'organizer_id');
    }
    public function department() {
        return \$this->belongsTo(Department::class);
    }
    public function type() {
        return \$this->belongsTo(MeetingType::class, 'meeting_type_id');
    }
    public function participants() {
        return \$this->hasMany(MeetingParticipant::class);
    }
    public function agendaItems() {
        return \$this->hasMany(MeetingAgendaItem::class);
    }
    public function minute() {
        return \$this->hasOne(MeetingMinute::class);
    }",
    'MeetingParticipant.php' => "
    public function meeting() {
        return \$this->belongsTo(Meeting::class);
    }
    public function user() {
        return \$this->belongsTo(User::class);
    }",
    'MeetingAgendaItem.php' => "
    public function meeting() {
        return \$this->belongsTo(Meeting::class);
    }
    public function speaker() {
        return \$this->belongsTo(User::class, 'speaker_id');
    }",
    'MeetingMinute.php' => "
    public function meeting() {
        return \$this->belongsTo(Meeting::class);
    }
    public function decisions() {
        return \$this->hasMany(MinuteDecision::class, 'minute_id');
    }
    public function agreements() {
        return \$this->hasMany(MinuteAgreement::class, 'minute_id');
    }
    public function publisher() {
        return \$this->belongsTo(User::class, 'published_by');
    }",
    'MinuteAgreement.php' => "
    public function minute() {
        return \$this->belongsTo(MeetingMinute::class, 'minute_id');
    }
    public function responsible() {
        return \$this->belongsTo(User::class, 'responsible_id');
    }
    public function department() {
        return \$this->belongsTo(Department::class);
    }
    public function updates() {
        return \$this->hasMany(AgreementUpdate::class, 'agreement_id');
    }",
    'User.php' => "
    public function department() {
        return \$this->belongsTo(Department::class);
    }"
];

foreach ($models as $filename => $methods) {
    $path = "app/Models/{$filename}";
    if (file_exists($path)) {
        $content = file_get_contents($path);
        // Remove the closing brace and add the methods
        $content = preg_replace('/}\s*$/', "\n" . trim($methods) . "\n}\n", $content);
        file_put_contents($path, $content);
        echo "Updated \$filename\n";
    }
}
