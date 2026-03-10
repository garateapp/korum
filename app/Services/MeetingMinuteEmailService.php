<?php

namespace App\Services;

use App\Mail\MeetingMinutePublishedMail;
use App\Models\Meeting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class MeetingMinuteEmailService
{
    public function sendPublishedMinute(Meeting $meeting): void
    {
        $meeting->loadMissing([
            'organizer',
            'participants.user',
            'department',
            'meetingType',
            'agendaItems.speaker',
            'minute.topics',
            'minute.decisions',
            'minute.agreements.responsible',
            'minute.agreements.responsibles',
        ]);

        if (!$meeting->minute || $meeting->minute->status !== 'published') {
            return;
        }

        $recipients = $this->resolveRecipients($meeting);
        if ($recipients->isEmpty()) {
            return;
        }

        $pdfContent = Pdf::loadView('pdf.minute', compact('meeting'))->output();

        foreach ($recipients as $recipient) {
            try {
                Mail::to($recipient['email'])->send(
                    new MeetingMinutePublishedMail(
                        meeting: $meeting,
                        recipientName: $recipient['name'],
                        pdfContent: $pdfContent,
                    )
                );
            } catch (\Throwable $exception) {
                Log::warning('No se pudo enviar el correo de minuta publicada.', [
                    'meeting_id' => $meeting->id,
                    'email' => $recipient['email'],
                    'error' => $exception->getMessage(),
                ]);
            }
        }
    }

    /**
     * @return Collection<int, array{email: string, name: string}>
     */
    private function resolveRecipients(Meeting $meeting): Collection
    {
        $recipients = collect();

        if ($meeting->organizer?->email) {
            $recipients->push([
                'email' => $meeting->organizer->email,
                'name' => (string) ($meeting->organizer->name ?? ''),
            ]);
        }

        foreach ($meeting->participants as $participant) {
            if ($participant->user?->email) {
                $recipients->push([
                    'email' => $participant->user->email,
                    'name' => (string) ($participant->user->name ?? ''),
                ]);
                continue;
            }

            if ($participant->external_email) {
                $recipients->push([
                    'email' => (string) $participant->external_email,
                    'name' => (string) ($participant->external_name ?? ''),
                ]);
            }
        }

        return $recipients
            ->filter(fn (array $recipient): bool => filter_var($recipient['email'], FILTER_VALIDATE_EMAIL) !== false)
            ->map(fn (array $recipient): array => [
                'email' => Str::lower(trim($recipient['email'])),
                'name' => trim($recipient['name']),
            ])
            ->unique('email')
            ->values();
    }
}
