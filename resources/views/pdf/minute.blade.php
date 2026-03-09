<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Acta de Reunión - {{ $meeting->code }}</title>
    <style>
        @page { margin: 100px 50px; }
        body { font-family: 'Helvetica', sans-serif; color: #1e293b; line-height: 1.5; font-size: 12px; }
        header { position: fixed; top: -70px; left: 0; right: 0; height: 50px; border-bottom: 2px solid #0056b3; }
        footer { position: fixed; bottom: -60px; left: 0; right: 0; height: 30px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 10px; color: #64748b; padding-top: 10px; }
        .logo { font-weight: 900; font-size: 24px; color: #0056b3; text-transform: uppercase; letter-spacing: -1px; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 10px; background: #f1f5f9; color: #475569; }
        .h1 { font-size: 20px; font-weight: 900; margin-bottom: 5px; color: #0f172a; }
        .grid { width: 100%; margin-bottom: 30px; }
        .grid td { vertical-align: top; padding: 10px 0; }
        .label { font-size: 9px; font-weight: bold; text-transform: uppercase; color: #94a3b8; display: block; margin-bottom: 2px; }
        .value { font-weight: bold; font-size: 12px; }
        .section-title { font-size: 14px; font-weight: 900; text-transform: uppercase; border-left: 4px solid #0056b3; padding-left: 10px; margin: 30px 0 15px; background: #f8fafc; padding-top: 5px; padding-bottom: 5px; }
        table.data { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table.data th { text-align: left; padding: 10px; background: #f1f5f9; border-bottom: 2px solid #e2e8f0; font-size: 10px; text-transform: uppercase; }
        table.data td { padding: 10px; border-bottom: 1px solid #f1f5f9; }
        .status-badge { font-size: 9px; padding: 2px 6px; border-radius: 99px; font-weight: bold; text-transform: uppercase; }
        .status-realizado { background: #dcfce7; color: #166534; }
        .status-pendiente { background: #fef9c3; color: #854d0e; }
        .status-atrasado { background: #fee2e2; color: #991b1b; }
        .footer-page:after { content: counter(page); }
    </style>
</head>
<body>
    <header>
        <table style="width: 100%;">
            <tr>
                <td class="logo">KORUM <small style="font-size: 10px; color: #94a3b8; font-weight: normal;">GOVERNANCE</small></td>
                <td style="text-align: right; color: #64748b; font-size: 10px;">{{ $meeting->code }} / Acta Oficial</td>
            </tr>
        </table>
    </header>

    <footer>
        Korum Governance System - Generado automáticamente el {{ now()->format('d/m/Y H:i') }} | Página <span class="footer-page"></span>
    </footer>

    <div class="h1">{{ $meeting->subject }}</div>
    <div style="margin-bottom: 30px; opacity: 0.6;">{{ $meeting->description }}</div>

    <table class="grid">
        <tr>
            <td style="width: 25%;">
                <span class="label">Fecha</span>
                <span class="value">{{ $meeting->date }}</span>
            </td>
            <td style="width: 25%;">
                <span class="label">Hora</span>
                <span class="value">{{ $meeting->start_time }} - {{ $meeting->end_time }}</span>
            </td>
            <td style="width: 25%;">
                <span class="label">Modalidad</span>
                <span class="value" style="text-transform: capitalize;">{{ $meeting->mode }}</span>
            </td>
            <td style="width: 25%;">
                <span class="label">Organizador</span>
                <span class="value">{{ $meeting->organizer->name }}</span>
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <span class="label">Departamento</span>
                <span class="value">{{ $meeting->department->name }}</span>
            </td>
            <td colspan="2">
                <span class="label">Ubicación / Link</span>
                <span class="value">{{ $meeting->location_link ?: 'N/A' }}</span>
            </td>
        </tr>
    </table>

    <div class="section-title">Asistencia</div>
    <table class="data">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            @foreach($meeting->participants as $p)
            <tr>
                <td style="font-weight: bold;">{{ $p->user?->name ?? $p->external_name }}</td>
                <td>{{ $p->role_in_meeting }}</td>
                <td>
                    <span class="badge">{{ $p->attendance_status ?: 'Pendiente' }}</span>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="section-title">Agenda y Temas Tratados</div>
    <table class="data">
        <thead>
            <tr>
                <th style="width: 40px;">#</th>
                <th>Tema</th>
                <th>Speaker</th>
                <th style="text-align: right;">Tiempo</th>
            </tr>
        </thead>
        <tbody>
            @foreach($meeting->agendaItems as $index => $item)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td style="font-weight: bold;">{{ $item->title }}</td>
                <td>{{ $item->speaker?->name ?: 'N/A' }}</td>
                <td style="text-align: right;">{{ $item->estimated_time_min }} Min</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="section-title">Acuerdos y Compromisos</div>
    <table class="data">
        <thead>
            <tr>
                <th>Acuerdo / Tarea</th>
                <th>Responsable</th>
                <th>Fecha Límite</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            @foreach($meeting->minute->agreements as $agreement)
            <tr>
                <td style="font-weight: bold;">{{ $agreement->subject }}</td>
                <td>
                    @if($agreement->responsibles->isNotEmpty())
                        {{ $agreement->responsibles->pluck('name')->join(', ') }}
                    @else
                        {{ $agreement->responsible?->name }}
                    @endif
                </td>
                <td style="color: #991b1b; font-weight: bold;">{{ $agreement->commitment_date }}</td>
                <td>
                    <span class="status-badge status-{{ str_replace(' ', '-', $agreement->status) }}">
                        {{ $agreement->status }}
                    </span>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    @if($meeting->minute->general_observations)
    <div class="section-title">Observaciones Adicionales</div>
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
        {!! nl2br(e($meeting->minute->general_observations)) !!}
    </div>
    @endif

    <div style="margin-top: 80px;">
        <table style="width: 100%;">
            <tr>
                <td style="width: 45%; text-align: center; border-top: 1px solid #cbd5e1; padding-top: 10px;">
                    <span style="font-size: 10px; font-weight: bold;">FIRMA ORGANIZADOR</span><br>
                    <small>{{ $meeting->organizer->name }}</small>
                </td>
                <td style="width: 10%;"></td>
                <td style="width: 45%; text-align: center; border-top: 1px solid #cbd5e1; padding-top: 10px;">
                    <span style="font-size: 10px; font-weight: bold;">AUTORIZACIÓN / FECHA</span><br>
                    <small>{{ now()->format('d/m/Y') }}</small>
                </td>
            </tr>
        </table>
    </div>

</body>
</html>
