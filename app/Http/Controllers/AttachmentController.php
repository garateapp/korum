<?php

namespace App\Http\Controllers;

use App\Models\Agreement;
use App\Models\Attachment;
use App\Models\Meeting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AttachmentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'file' => 'required|file|max:10240', // 10MB
            'attachable_type' => ['required', 'string', Rule::in([Meeting::class, Agreement::class])],
            'attachable_id' => 'required|integer',
        ]);

        $attachable = $this->resolveAttachable($validated['attachable_type'], (int) $validated['attachable_id']);
        $this->authorizeAttachmentUpload($request->user(), $attachable);

        $file = $validated['file'];
        $type = $validated['attachable_type'];
        $id = $validated['attachable_id'];

        // Determinar carpeta según tipo
        $folder = 'attachments/' . strtolower(class_basename($type));
        $path = $file->store($folder, 'public');

        Attachment::create([
            'attachable_type' => $type,
            'attachable_id' => $id,
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'extension' => $file->getClientOriginalExtension(),
            'size_kb' => round($file->getSize() / 1024),
            'uploaded_by' => auth()->id(),
        ]);

        return back()->with('success', 'Archivo subido correctamente.');
    }

    public function destroy(Request $request, Attachment $attachment)
    {
        if (!$request->user()->hasRole('Admin') && $attachment->uploaded_by !== $request->user()->id) {
            abort(403, 'No tienes permiso para eliminar este archivo.');
        }

        if (Storage::disk('public')->exists($attachment->file_path)) {
            Storage::disk('public')->delete($attachment->file_path);
        }

        $attachment->delete();

        return back()->with('success', 'Archivo eliminado.');
    }

    protected function resolveAttachable(string $type, int $id): Meeting|Agreement
    {
        if ($type === Meeting::class) {
            return Meeting::findOrFail($id);
        }

        return Agreement::with(['responsibles', 'minute.meeting'])->findOrFail($id);
    }

    protected function authorizeAttachmentUpload($user, Meeting|Agreement $attachable): void
    {
        if ($user->hasRole('Admin')) {
            return;
        }

        if ($attachable instanceof Meeting) {
            $isOrganizer = (int) $attachable->organizer_id === (int) $user->id;
            $isParticipant = $attachable->participants()->where('user_id', $user->id)->exists();

            abort_unless($isOrganizer || $isParticipant, 403, 'No tienes permiso para adjuntar archivos en esta reunión.');
            return;
        }

        $isLegacyResponsible = (int) $attachable->responsible_id === (int) $user->id;
        $isResponsible = $attachable->responsibles->contains('id', $user->id);
        $isMeetingOrganizer = (int) optional(optional($attachable->minute)->meeting)->organizer_id === (int) $user->id;

        abort_unless(
            $isLegacyResponsible || $isResponsible || $isMeetingOrganizer,
            403,
            'No tienes permiso para adjuntar archivos en este acuerdo.'
        );
    }
}
