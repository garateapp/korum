<?php

namespace App\Console\Commands;

use App\Models\Agreement;
use App\Notifications\CommitmentDueSoon;
use App\Notifications\CommitmentOverdue;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;

class CheckDeadlines extends Command
{
    protected $signature = 'app:check-deadlines';
    protected $description = 'Notificar compromisos por vencer y atrasados';

    public function handle(): int
    {
        $today = Carbon::today();
        $dueSoonDate = $today->copy()->addDays(2)->toDateString();

        $dueSoonAgreements = Agreement::query()
            ->where('status', '!=', 'realizado')
            ->whereDate('commitment_date', $dueSoonDate)
            ->with(['responsibles', 'responsible'])
            ->get();

        $dueSoonSent = 0;
        foreach ($dueSoonAgreements as $agreement) {
            $recipients = $this->resolveRecipients($agreement, includeOrganizer: false);
            foreach ($recipients as $recipient) {
                $recipient->notify(new CommitmentDueSoon($agreement));
                $dueSoonSent++;
            }
        }

        $overdueAgreements = Agreement::query()
            ->where('status', '!=', 'realizado')
            ->whereDate('commitment_date', '<', $today->toDateString())
            ->with(['responsibles', 'responsible', 'minute.meeting.organizer'])
            ->get();

        $overdueSent = 0;
        foreach ($overdueAgreements as $agreement) {
            $recipients = $this->resolveRecipients($agreement, includeOrganizer: true);
            foreach ($recipients as $recipient) {
                $recipient->notify(new CommitmentOverdue($agreement));
                $overdueSent++;
            }
        }

        $this->info("Recordatorios por vencer enviados: {$dueSoonSent}");
        $this->info("Alertas por atraso enviadas: {$overdueSent}");
        $this->info('Chequeo de vencimientos completado.');

        return self::SUCCESS;
    }

    /**
     * @return Collection<int, \App\Models\User>
     */
    private function resolveRecipients(Agreement $agreement, bool $includeOrganizer): Collection
    {
        $recipients = collect();

        if ($agreement->relationLoaded('responsibles') && $agreement->responsibles->isNotEmpty()) {
            $recipients = $recipients->merge($agreement->responsibles);
        } elseif ($agreement->responsible) {
            $recipients->push($agreement->responsible);
        }

        if ($includeOrganizer && $agreement->minute?->meeting?->organizer) {
            $recipients->push($agreement->minute->meeting->organizer);
        }

        return $recipients
            ->filter(fn ($user): bool => !empty($user->email))
            ->unique('id')
            ->values();
    }
}
