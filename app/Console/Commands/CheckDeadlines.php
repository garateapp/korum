<?php

namespace App\Console\Commands;

use App\Models\Agreement;
use App\Notifications\CommitmentDueSoon;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CheckDeadlines extends Command
{
    protected $signature = 'app:check-deadlines';
    protected $description = 'Notificar compromisos próximos a vencer';

    public function handle()
    {
        $targetDate = Carbon::now()->addDays(2)->toDateString();
        
        $agreements = Agreement::where('status', '!=', 'realizado')
            ->where('commitment_date', $targetDate)
            ->with('responsible')
            ->get();

        foreach ($agreements as $agreement) {
            if ($agreement->responsible) {
                $agreement->responsible->notify(new CommitmentDueSoon($agreement));
                $this->info("Notificación enviada a {$agreement->responsible->name} por el acuerdo {$agreement->id}");
            }
        }

        $this->info('Chequeo de vencimientos completado.');
    }
}
