<?php

namespace App\Notifications;

use App\Models\Agreement;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AgreementStatusChanged extends Notification
{
    use Queueable;

    public function __construct(public Agreement $agreement, public User $updater)
    {
    }

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Actualización de Acuerdo: ' . $this->agreement->subject)
            ->greeting('Hola ' . $notifiable->name)
            ->line('Se ha registrado un nuevo avance en el acuerdo: ' . $this->agreement->subject)
            ->line('Nuevo estado: ' . strtoupper($this->agreement->status))
            ->line('Actualizado por: ' . $this->updater->name)
            ->action('Ver Acuerdo', route('agreements.show', $this->agreement->id))
            ->line('Gracias por usar Korum.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'agreement_id' => $this->agreement->id,
            'subject' => $this->agreement->subject,
            'status' => $this->agreement->status,
            'updater_name' => $this->updater->name,
            'message' => "{$this->updater->name} cambió el estado a {$this->agreement->status}",
            'type' => 'status_change'
        ];
    }
}
