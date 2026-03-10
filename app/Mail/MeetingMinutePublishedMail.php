<?php

namespace App\Mail;

use App\Models\Meeting;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Symfony\Component\Mime\Email;

class MeetingMinutePublishedMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        public readonly Meeting $meeting,
        public readonly string $recipientName,
        private readonly string $pdfContent,
    ) {
    }

    public function build(): self
    {
        $minuteId = (int) ($this->meeting->minute?->id ?? 0);
        $meetingCode = (string) ($this->meeting->code ?? 'Reunion');

        return $this->subject('Acta oficial disponible: '.$meetingCode)
            ->view('emails.minute-published')
            ->with([
                'recipientName' => $this->recipientName !== '' ? $this->recipientName : 'equipo',
                'meeting' => $this->meeting,
                'minuteUrl' => $minuteId > 0 ? route('minutes.show', $minuteId) : route('meetings.show', $this->meeting->id),
            ])
            ->attachData(
                $this->pdfContent,
                'Acta_'.$meetingCode.'.pdf',
                ['mime' => 'application/pdf']
            )
            ->withSymfonyMessage(function (Email $message): void {
                $headers = $message->getHeaders();
                $headers->addTextHeader('X-Mailgun-Track', 'no');
                $headers->addTextHeader('X-Mailgun-Track-Clicks', 'no');
                $headers->addTextHeader('X-Mailgun-Track-Opens', 'no');
            });
    }
}
