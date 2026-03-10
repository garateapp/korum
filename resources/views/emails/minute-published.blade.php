<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Acta oficial publicada</title>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; color: #111827; line-height: 1.5; margin: 0; padding: 24px; background: #f8fafc;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 720px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb;">
        <tr>
            <td style="padding: 24px;">
                <h1 style="margin: 0 0 12px; font-size: 22px;">Acta oficial disponible</h1>
                <p style="margin: 0 0 16px;">Hola {{ $recipientName }},</p>
                <p style="margin: 0 0 16px;">
                    La minuta oficial de la reunion <strong>{{ $meeting->subject }}</strong>
                    ({{ $meeting->code }}) ya fue publicada.
                </p>
                <p style="margin: 0 0 16px;">
                    En este correo va adjunto el PDF del acta oficial.
                </p>
                <p style="margin: 0 0 20px;">
                    Si tienes acceso a Korum, tambien puedes revisarla en linea:
                </p>
                <p style="margin: 0 0 24px;">
                    <a href="{{ $minuteUrl }}" style="display: inline-block; padding: 10px 16px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        Ver minuta en Korum
                    </a>
                </p>
                <p style="margin: 0; color: #6b7280; font-size: 13px;">
                    Correo automatico generado por Korum.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
