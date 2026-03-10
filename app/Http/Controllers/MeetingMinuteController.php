<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingMinute;
use App\Services\MeetingMinuteEmailService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class MeetingMinuteController extends Controller
{
    public function __construct(private readonly MeetingMinuteEmailService $meetingMinuteEmailService)
    {
    }

    public function create(Meeting $meeting)
    {
        $meeting->load([
            'participants.user',
            'agendaItems.speaker',
            'minute.agreements.responsibles',
            'minute.decisions',
            'minute.topics',
        ]);

        if ($meeting->minute && $meeting->minute->status === 'published') {
            return redirect()->route('minutes.show', $meeting->minute->id);
        }

        $invitedUsers = $meeting->participants
            ->pluck('user')
            ->filter()
            ->unique('id')
            ->map(fn ($user): array => [
                'id' => $user->id,
                'name' => $user->name,
            ])
            ->values();

        return Inertia::render('Minutes/Create', [
            'meeting' => $meeting,
            'minute' => $meeting->minute,
            'users' => $invitedUsers,
            'departments' => \App\Models\Department::all(['id', 'name']),
        ]);
    }

    public function store(Request $request, Meeting $meeting)
    {
        $validated = $request->validate([
            'action' => ['nullable', Rule::in(['draft', 'publish'])],
            'notes' => 'nullable|string',
            'observations' => 'nullable|string',
            'agreements' => 'nullable|array',
            'agreements.*.subject' => 'nullable|string',
            'agreements.*.responsible_ids' => 'nullable|array',
            'agreements.*.responsible_ids.*' => 'exists:users,id',
            'agreements.*.commitment_date' => 'nullable|date',
            'agreements.*.department_id' => 'nullable|exists:departments,id',
            'decisions' => 'nullable|array',
            'decisions.*.description' => 'nullable|string',
            'topics' => 'nullable|array',
            'topics.*.title' => 'nullable|string',
            'topics.*.detail' => 'nullable|string',
            'topics.*.conclusions' => 'nullable|string',
        ]);

        $action = (string) ($validated['action'] ?? 'draft');
        $isPublishing = $action === 'publish';
        $invitedUserIds = $meeting->participants()
            ->whereNotNull('user_id')
            ->pluck('user_id')
            ->map(fn ($id): int => (int) $id)
            ->unique()
            ->values()
            ->all();

        $hasInvalidResponsible = collect($validated['agreements'] ?? [])->contains(
            function (array $agreement) use ($invitedUserIds): bool {
                return collect($agreement['responsible_ids'] ?? [])
                    ->contains(fn ($id): bool => !in_array((int) $id, $invitedUserIds, true));
            }
        );

        if ($hasInvalidResponsible) {
            throw ValidationException::withMessages([
                'agreements' => 'Solo puedes asignar responsables que estén invitados a la reunión.',
            ]);
        }

        $summary = $this->nullableTrim($validated['notes'] ?? null);
        $observations = $this->nullableTrim($validated['observations'] ?? null);
        $agreements = $this->normalizeAgreements($validated['agreements'] ?? []);
        $completeAgreements = array_values(array_filter(
            $agreements,
            fn (array $agreement): bool => $this->isAgreementComplete($agreement)
        ));
        $incompleteAgreementsCount = count($agreements) - count($completeAgreements);
        $decisions = $this->normalizeDecisions($validated['decisions'] ?? []);
        $topics = $this->normalizeTopics($validated['topics'] ?? []);

        if ($isPublishing) {
            $this->ensurePublishRequirements($summary, $agreements);
        }

        DB::beginTransaction();
        try {
            $minute = $meeting->minute()->firstOrNew();

            if ($minute->exists && $minute->status === 'published') {
                throw ValidationException::withMessages([
                    'action' => 'La minuta ya está publicada y no puede volver a editarse.',
                ]);
            }

            $minute->fill([
                'summary' => $summary,
                'general_observations' => $observations,
                'status' => $isPublishing ? 'published' : 'draft',
                'published_by' => $isPublishing ? auth()->id() : null,
                'published_at' => $isPublishing ? now() : null,
            ]);
            $minute->save();

            $minute->agreements()->delete();
            $minute->decisions()->delete();
            $minute->topics()->delete();

            foreach ($completeAgreements as $agreementData) {
                $responsibleIds = $agreementData['responsible_ids'];
                unset($agreementData['responsible_ids']);

                $agreementData['responsible_id'] = $responsibleIds[0] ?? null;

                $agreement = $minute->agreements()->create($agreementData);
                $agreement->responsibles()->sync($responsibleIds);
            }

            foreach ($decisions as $decisionData) {
                $minute->decisions()->create($decisionData);
            }

            foreach ($topics as $index => $topicData) {
                $minute->topics()->create(array_merge($topicData, ['order' => $index + 1]));
            }

            if ($isPublishing) {
                $meeting->update(['status' => 'realizada']);
            }

            DB::commit();
            if ($isPublishing) {
                $redirect = redirect()->route('meetings.show', $meeting->id)
                    ->with('success', 'Minuta publicada exitosamente.');

                try {
                    $this->meetingMinuteEmailService->sendPublishedMinute($meeting);
                } catch (\Throwable $exception) {
                    report($exception);
                    $redirect->with(
                        'warning',
                        'La minuta se publico, pero hubo un problema enviando algunos correos de notificacion.'
                    );
                }

                return $redirect;
            }

            $redirect = redirect()->route('meetings.minute.create', $meeting->id)
                ->with('success', 'Borrador guardado exitosamente.');

            if ($incompleteAgreementsCount > 0) {
                $redirect->with(
                    'warning',
                    'Se omitieron acuerdos incompletos en el borrador. Completa responsable, fecha y área para guardarlos.'
                );
            }

            return $redirect;
        } catch (ValidationException $exception) {
            DB::rollBack();
            throw $exception;
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al guardar la minuta: '.$e->getMessage()]);
        }
    }

    public function show(MeetingMinute $minute)
    {
        $minute->load([
            'meeting.department',
            'meeting.meetingType',
            'meeting.participants.user',
            'agreements.responsibles',
            'agreements.department',
            'decisions',
            'topics',
            'publisher',
        ]);
        return Inertia::render('Minutes/Show', [
            'minute' => $minute
        ]);
    }

    private function nullableTrim(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $trimmed = trim($value);
        return $trimmed === '' ? null : $trimmed;
    }

    /**
     * @param  array<int, array<string, mixed>>  $agreements
     * @return array<int, array<string, mixed>>
     */
    private function normalizeAgreements(array $agreements): array
    {
        return collect($agreements)
            ->map(function (array $agreement): array {
                $subject = trim((string) ($agreement['subject'] ?? ''));
                $commitmentDate = (string) ($agreement['commitment_date'] ?? '');
                $departmentId = $agreement['department_id'] ?? null;
                $responsibleIds = collect($agreement['responsible_ids'] ?? [])
                    ->filter(fn ($id) => $id !== null && $id !== '')
                    ->map(fn ($id) => (int) $id)
                    ->unique()
                    ->values()
                    ->all();

                return [
                    'subject' => $subject,
                    'responsible_ids' => $responsibleIds,
                    'commitment_date' => $commitmentDate !== '' ? $commitmentDate : null,
                    'department_id' => $departmentId !== null && $departmentId !== '' ? (int) $departmentId : null,
                ];
            })
            ->filter(function (array $agreement): bool {
                return $agreement['subject'] !== ''
                    || !empty($agreement['responsible_ids'])
                    || !empty($agreement['commitment_date'])
                    || !empty($agreement['department_id']);
            })
            ->values()
            ->all();
    }

    /**
     * @param  array<int, array<string, mixed>>  $decisions
     * @return array<int, array<string, string>>
     */
    private function normalizeDecisions(array $decisions): array
    {
        return collect($decisions)
            ->map(fn (array $decision): array => [
                'description' => trim((string) ($decision['description'] ?? '')),
            ])
            ->filter(fn (array $decision): bool => $decision['description'] !== '')
            ->values()
            ->all();
    }

    /**
     * @param  array<int, array<string, mixed>>  $topics
     * @return array<int, array<string, string|null>>
     */
    private function normalizeTopics(array $topics): array
    {
        return collect($topics)
            ->map(function (array $topic): array {
                $title = trim((string) ($topic['title'] ?? ''));
                $detail = trim((string) ($topic['detail'] ?? ''));
                $conclusions = trim((string) ($topic['conclusions'] ?? ''));

                return [
                    'title' => $title,
                    'detail' => $detail !== '' ? $detail : null,
                    'conclusions' => $conclusions !== '' ? $conclusions : null,
                ];
            })
            ->filter(function (array $topic): bool {
                return $topic['title'] !== ''
                    || !empty($topic['detail'])
                    || !empty($topic['conclusions']);
            })
            ->values()
            ->all();
    }

    /**
     * @param  array<int, array<string, mixed>>  $agreements
     */
    private function ensurePublishRequirements(?string $summary, array $agreements): void
    {
        $errors = [];

        if ($summary === null) {
            $errors['notes'] = 'Para publicar debes completar el resumen/desarrollo de la reunión.';
        }

        if (empty($agreements)) {
            $errors['agreements'] = 'Para publicar debes registrar al menos un acuerdo.';
        } else {
            $hasIncompleteAgreement = collect($agreements)->contains(function (array $agreement): bool {
                return !$this->isAgreementComplete($agreement);
            });

            if ($hasIncompleteAgreement) {
                $errors['agreements'] = 'Hay acuerdos incompletos. Completa responsable(s), fecha y área antes de publicar.';
            }
        }

        if (!empty($errors)) {
            throw ValidationException::withMessages($errors);
        }
    }

    /**
     * @param  array<string, mixed>  $agreement
     */
    private function isAgreementComplete(array $agreement): bool
    {
        return $agreement['subject'] !== ''
            && !empty($agreement['responsible_ids'])
            && !empty($agreement['commitment_date'])
            && !empty($agreement['department_id']);
    }
}
