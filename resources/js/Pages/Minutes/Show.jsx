import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { IconArrowLeft, IconFileCheck, IconUsers, IconCalendar, IconClock, IconMapPin, IconVideo, IconCheckbox, IconExclamationCircle } from '@tabler/icons-react';

export default function Show({ auth, minute }) {
    const meeting = minute.meeting;
    const participants = meeting.participants ?? [];
    const publishedAt = minute.published_at ? new Date(minute.published_at).toLocaleDateString() : 'Sin publicar';
    const getParticipantName = (participant) =>
        participant.user?.name?.trim()
        || participant.external_name?.trim()
        || participant.user?.email
        || participant.external_email
        || 'Sin nombre';

    return (
        <AuthenticatedLayout header="Minuta de Reunión">
            <Head title={`Minuta ${meeting.code}`} />

            <div className="flex flex-col items-center gap-8 mb-12 p-12 bg-white rounded-[40px] border border-base-200 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <img src="/img/logo-korum.png" alt="Korum" className="h-[120px] w-auto object-contain" />
                    <div className="hidden md:block w-px h-20 bg-base-200"></div>
                    <img src="/img/logogreenex.png" alt="Greenex" className="h-[80px] w-auto object-contain grayscale opacity-40 hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">{meeting.code}</h2>
                    <div className="flex items-center justify-center gap-3">
                        <span className="h-px w-8 bg-primary/30"></span>
                        <p className="text-[12px] font-black tracking-[0.3em] text-primary uppercase">Documento de Minuta Oficial</p>
                        <span className="h-px w-8 bg-primary/30"></span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Versión {minute.version || '1.0'} • {minute.status === 'published' ? `Publicado el ${publishedAt}` : `Estado ${minute.status}`}</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                <div className="text-center md:text-left">
                    <h3 className="text-4xl font-black text-gray-900 tracking-tight mb-2">{meeting.subject}</h3>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Acta Finalizada • Ref. {meeting.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 no-print">
                    <Link href={route('meetings.show', meeting.id)} className="btn btn-ghost hover:bg-base-200 rounded-2xl px-6">
                        <IconArrowLeft size={20} /> <span className="font-bold">Volver</span>
                    </Link>
                    <a
                        href={route('meetings.export', meeting.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-lg rounded-2xl px-10 shadow-xl shadow-primary/20 transition-all hover:scale-105"
                    >
                        Imprimir Acta Oficial
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">

                {/* Contenido Principal */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Resumen */}
                    <div className="bg-base-100 shadow-sm sm:rounded-lg p-8 border-t-4 border-primary">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                            <IconFileCheck /> Resumen y Desarrollo
                        </h3>
                        <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                            {minute.summary}
                        </div>

                        {minute.topics?.length > 0 && (
                            <div className="mt-10 space-y-8">
                                <h4 className="font-black text-xs uppercase tracking-widest opacity-40 border-b pb-2">Desglose de Temas</h4>
                                {minute.topics.map((topic, i) => (
                                    <div key={topic.id} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary/20 rounded">
                                        <h5 className="font-black text-lg mb-2 text-primary/80">{i + 1}. {topic.title}</h5>
                                        <p className="text-sm opacity-70 mb-3">{topic.detail}</p>
                                        {topic.conclusions && (
                                            <div className="p-3 bg-success/5 rounded-xl border border-success/10 text-sm">
                                                <span className="font-black text-[10px] uppercase text-success block mb-1">Conclusión</span>
                                                {topic.conclusions}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {minute.general_observations && (
                            <>
                                <div className="divider"></div>
                                <h4 className="font-bold text-sm uppercase text-gray-500 mb-2">Observaciones</h4>
                                <p className="text-sm italic text-gray-600">{minute.general_observations}</p>
                            </>
                        )}
                    </div>

                    {/* Acuerdos */}
                    <div className="bg-base-100 shadow-sm sm:rounded-lg p-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <IconCheckbox className="text-success" /> Acuerdos y Compromisos
                        </h3>
                        {minute.agreements?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr className="bg-base-200">
                                            <th>Acuerdo</th>
                                            <th>Responsable</th>
                                            <th>Área</th>
                                            <th>Fecha Compromiso</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {minute.agreements.map(a => (
                                            <tr key={a.id}>
                                                <td className="font-medium">{a.subject}</td>
                                                <td>
                                                    <div className="flex flex-wrap gap-1">
                                                        {a.responsibles?.map(r => (
                                                            <span key={r.id} className="badge badge-sm badge-outline border-primary/30 text-primary font-bold">{r.name}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td>{a.department?.name}</td>
                                                <td>{a.commitment_date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center py-4 text-gray-400">No se registraron acuerdos en esta sesión.</p>
                        )}
                    </div>

                    {/* Decisiones */}
                    {minute.decisions?.length > 0 && (
                        <div className="bg-base-100 shadow-sm sm:rounded-lg p-8">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <IconExclamationCircle className="text-info" /> Decisiones Tomadas
                            </h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                {minute.decisions.map(d => (
                                    <li key={d.id}>{d.description}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>

                {/* Sidebar - Meta Información */}
                <div className="space-y-6">

                    {/* Detalles de la Reunión */}
                    <div className="bg-base-100 shadow-sm sm:rounded-lg p-6">
                        <h4 className="font-bold text-sm uppercase text-gray-500 mb-4 border-b pb-2">Información de Sesión</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <IconCalendar size={18} className="text-gray-400 mt-1" />
                                <div>
                                    <p className="text-xs uppercase text-gray-400 font-bold">Fecha</p>
                                    <p className="text-sm">{meeting.date}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <IconClock size={18} className="text-gray-400 mt-1" />
                                <div>
                                    <p className="text-xs uppercase text-gray-400 font-bold">Horario</p>
                                    <p className="text-sm">{meeting.start_time.substring(0, 5)} - {meeting.end_time.substring(0, 5)}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                {meeting.mode === 'virtual' ? <IconVideo size={18} className="text-info mt-1" /> : <IconMapPin size={18} className="text-error mt-1" />}
                                <div>
                                    <p className="text-xs uppercase text-gray-400 font-bold">Modalidad / Ubicación</p>
                                    <p className="text-sm capitalize">{meeting.mode}</p>
                                    <p className="text-xs opacity-60">{meeting.location_link}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lista de Asistencia Re-validada */}
                    <div className="bg-base-100 shadow-sm sm:rounded-lg p-6">
                        <h4 className="font-bold text-sm uppercase text-gray-500 mb-4 border-b pb-2 flex justify-between">
                            Asistencia <IconUsers size={16} />
                        </h4>
                        <ul className="space-y-3">
                            {participants.map(p => (
                                <li key={p.id} className="flex justify-between items-center text-sm">
                                    <span>{getParticipantName(p)}</span>
                                    <span className={`badge badge-xs ${p.attendance_status === 'presente' ? 'badge-success' : 'badge-ghost opacity-50'}`}>
                                        {p.attendance_status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}
