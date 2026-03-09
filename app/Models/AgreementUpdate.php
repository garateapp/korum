<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AgreementUpdate extends Model
{
    protected $guarded = [];

    public function agreement()
    {
        return $this->belongsTo(Agreement::class, 'agreement_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
