<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $guarded = [];

    public function users() {
        return $this->hasMany(User::class);
    }

    public function meetings() {
        return $this->hasMany(Meeting::class);
    }

    public function agreements() {
        return $this->hasMany(Agreement::class, 'department_id');
    }
}
