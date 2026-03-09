<?php

namespace App\Notifications;

use App\Models\Agreement;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CommitmentDueSoon extends Notification
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
        return (new MailMessage)
            ->subject('⚠️ Recordatorio: Compromiso por vencer - ' . $this->agreement->subject)
            ->greeting('Hola ' . $notifiable->name)
            ->line('Este es un recordatorio de un compromiso que vence pronto.')
            ->line('Acuerdo: ' . $this->agreement->subject)
            ->line('Fecha límite: ' . $this->agreement->commitment_date)
            ->action('Ver y Actualizar', route('agreements.show', $this->agreement->id))
            ->line('Por favor asegúrate de registrar tus avances a tiempo.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'agreement_id' => $this->agreement->id,
            'subject' => $this->agreement->subject,
            'due_date' => $this->agreement->commitment_date,
            'message' => "Tu compromiso vence el {$this->agreement->commitment_date}",
            'type' => 'due_soon'
        ];
    }
}
