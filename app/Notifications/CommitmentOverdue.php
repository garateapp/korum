<?php

namespace App\Notifications;

use App\Models\Agreement;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CommitmentOverdue extends Notification
{
    use Queueable;

    public function __construct(public Agreement $agreement)
    {
    }

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $dueDate = Carbon::parse($this->agreement->commitment_date);
        $daysOverdue = max(1, $dueDate->diffInDays(now()));

        return (new MailMessage)
            ->subject('Alerta de atraso: ' . $this->agreement->subject)
            ->greeting('Hola ' . ($notifiable->name ?? ''))
            ->line('El siguiente acuerdo se encuentra atrasado:')
            ->line('Acuerdo: ' . $this->agreement->subject)
            ->line('Fecha limite: ' . $dueDate->toDateString())
            ->line('Dias de atraso: ' . $daysOverdue)
            ->action('Ver acuerdo', route('agreements.show', $this->agreement->id))
            ->line('Por favor registra avances y actualiza su estado.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'agreement_id' => $this->agreement->id,
            'subject' => $this->agreement->subject,
            'due_date' => $this->agreement->commitment_date,
            'message' => 'El acuerdo se encuentra atrasado.',
            'type' => 'overdue',
        ];
    }
}
