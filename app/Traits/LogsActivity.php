<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;

trait LogsActivity
{
    protected static function bootLogsActivity()
    {
        static::created(function (Model $model) {
            static::logActivity($model, 'creado');
        });

        static::updated(function (Model $model) {
            static::logActivity($model, 'editado');
        });

        static::deleted(function (Model $model) {
            static::logActivity($model, 'eliminado');
        });
    }

    protected static function logActivity(Model $model, string $action)
    {
        AuditLog::create([
            'entity_type' => get_class($model),
            'entity_id' => $model->id,
            'action' => $action,
            'old_values' => $action === 'creado' ? null : $model->getOriginal(),
            'new_values' => $action === 'eliminado' ? null : $model->getAttributes(),
            'user_id' => auth()->id(),
        ]);
    }
}
