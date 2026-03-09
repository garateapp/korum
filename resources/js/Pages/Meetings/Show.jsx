import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import ResourceFolder from '@/Components/ResourceFolder';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Plus,
    Calendar,
    Clock,
    MapPin,
    Video,
    Users,
    ChevronDown,
    FileText,
    ListTodo,
    ExternalLink,
    AlertCircle,
    CheckCircle,
    CheckCircle2,
    Info,
    ChevronRight,
    PlayCircle,
    MoreVertical,
    UserPlus,
    MessageSquare,
    ClipboardList,
    Clock3,
    Download,
    XCircle
} from 'lucide-react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Show({ auth, meeting, users }) {
    const [activeTab, setActiveTab] = useState('antes'); // antes, durante, despues
    const [agendaModal, setAgendaModal] = useState(false);
    const [participantModal, setParticipantModal] = useState(false);

    const agendaForm = useForm({ title: '', description: '', speaker_id: '', estimated_time_min: 15 });
    const participantForm = useForm({ user_id: '', external_name: '', role_in_meeting: 'Asistente' });

    const addAgendaItem = (e) => {
        e.preventDefault();
        agendaForm.post(route('meetings.agenda.store', meeting.id), {
            onSuccess: () => { setAgendaModal(false); agendaForm.reset(); }
        });
    };

    const addParticipant = (e) => {
        e.preventDefault();
        participantForm.post(route('meetings.participants.store', meeting.id), {
            onSuccess: () => { setParticipantModal(false); participantForm.reset(); }
        });
    };

    const deleteAgendaItem = (id) => { if (confirm('¿Eliminar este tema?')) agendaForm.delete(route('meetings.agenda.destroy', [meeting.id, id])); };
    const deleteParticipant = (id) => { if (confirm('¿Eliminar participante?')) participantForm.delete(route('meetings.participants.destroy', [meeting.id, id])); };
    const updateAttendance = (pId, status) => {
        router.patch(route('meetings.participants.update', [meeting.id, pId]), {
            attendance_status: status
        }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const cancelMeeting = () => {
        if (confirm('¿Está seguro de que desea cancelar esta reunión?')) {
            router.patch(route('meetings.cancel', meeting.id));
        }
    };

    const steps = [
        { id: 'antes', label: 'Antes', sub: 'Planificación', icon: ListTodo },
        { id: 'durante', label: 'Durante', sub: 'Desarrollo', icon: PlayCircle },
        { id: 'despues', label: 'Después', sub: 'Resultados', icon: CheckCircle2 },
    ];

    return (
        <AuthenticatedLayout header="Detalle de Reunión">
            <Head title={`Reunión ${meeting.code}`} />

            {/* Header Header "Glass" Style */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-black text-base-content tracking-tight">{meeting.subject}</h2>
                        <span className={`badge badge-lg font-bold border-none capitalize ${meeting.status === 'programada' ? 'bg-primary/10 text-primary' : (meeting.status === 'realizada' ? 'bg-success/10 text-success' : 'bg-base-300 text-base-content/40')}`}>
                            {meeting.status}
                        </span>
                    </div>
                    <p className="text-sm font-bold opacity-40 uppercase tracking-widest mt-2">{meeting.code} • {meeting.department?.name}</p>
                </div>
                <div className="flex gap-3">
                    <Link href={route('meetings.index')} className="btn btn-ghost border-base-300 rounded-2xl group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Listado
                    </Link>
                    {meeting.status !== 'cerrada' && meeting.status !== 'cancelada' && (
                        <>
                            <button onClick={cancelMeeting} className="btn btn-ghost text-error rounded-2xl group">
                                <XCircle size={20} className="group-hover:scale-110 transition-transform" /> Cancelar
                            </button>
                            <Link href={route('meetings.edit', meeting.id)} className="btn btn-primary rounded-2xl shadow-xl shadow-primary/20">
                                <Edit size={18} /> Editar Datos
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* SPECTACULAR STEPPER */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {steps.map((step, idx) => (
                    <button
                        key={step.id}
                        onClick={() => setActiveTab(step.id)}
                        className={`bento-card p-4 flex items-center gap-4 transition-all ${activeTab === step.id ? 'border-primary ring-2 ring-primary/10 bg-primary/5' : 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100 border-transparent bg-base-200'}`}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${activeTab === step.id ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'bg-base-300 text-base-content'}`}>
                            <step.icon size={24} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-50">{step.sub}</p>
                            <h4 className="font-black text-lg">{step.label}</h4>
                        </div>
                        {idx < steps.length - 1 && <div className="hidden md:block flex-1 border-t border-dashed border-base-300 mx-4"></div>}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.02, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'antes' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bento-card">
                                    <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Info className="text-primary" /> Información Base</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <p className="text-sm font-bold opacity-70 leading-relaxed">{meeting.description || 'Sin descripción detallada.'}</p>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-2xl">
                                                <div className="p-2 bg-base-100 rounded-lg text-primary"><Calendar size={18} /></div>
                                                <span className="text-sm font-bold">{meeting.date}</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-2xl">
                                                <div className="p-2 bg-base-100 rounded-lg text-primary"><Clock size={18} /></div>
                                                <span className="text-sm font-bold">{meeting.start_time.substring(0, 5)} - {meeting.end_time.substring(0, 5)} hrs</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-2xl">
                                                <div className="p-2 bg-base-100 rounded-lg text-primary">{meeting.mode === 'virtual' ? <Video size={18} /> : <MapPin size={18} />}</div>
                                                <span className="text-sm font-bold capitalize">{meeting.mode} • {meeting.location_link}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bento-card">
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="text-xl font-black flex items-center gap-2"><ListTodo className="text-primary" /> Puntos de Agenda</h3>
                                        <button onClick={() => setAgendaModal(true)} className="btn btn-sm btn-primary rounded-xl px-4 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">
                                            <Plus size={14} /> Agregar
                                        </button>
                                    </div>
                                    {meeting.agenda_items?.length > 0 ? (
                                        <div className="space-y-3">
                                            {meeting.agenda_items.map((item, i) => (
                                                <div key={item.id} className="group p-4 bg-base-200 rounded-2xl flex justify-between items-center border border-transparent hover:border-primary/20 hover:bg-base-100 transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <span className="w-8 h-8 rounded-lg bg-base-300 flex items-center justify-center font-black text-xs">{i + 1}</span>
                                                        <div>
                                                            <p className="font-bold text-sm">{item.title}</p>
                                                            <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{item.speaker?.name || 'Por definir'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="badge badge-ghost font-bold text-[10px] py-3">{item.estimated_time_min} MIN</span>
                                                        <button onClick={() => deleteAgendaItem(item.id)} className="btn btn-ghost btn-xs btn-circle text-error opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="p-10 text-center opacity-30 font-bold text-sm italic">Define la agenda para una reunión exitosa.</p>
                                    )}
                                </div>
                            </div>
                            <div className="lg:col-span-1 space-y-6"> {/* Added space-y-6 for spacing between cards */}
                                <div className="bento-card">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-black flex items-center gap-2"><Users className="text-primary" /> Invitados</h3>
                                        <button onClick={() => setParticipantModal(true)} className="btn btn-ghost btn-sm btn-circle"><Plus size={18} /></button>
                                    </div>
                                    {meeting.participants?.length > 0 ? (
                                        <div className="space-y-4">
                                            {meeting.participants.map(p => (
                                                <div key={p.id} className="flex items-center justify-between p-3 bg-base-200 rounded-2xl border border-transparent hover:border-primary/10 group transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <div className="avatar placeholder">
                                                            <div className="bg-primary/20 text-primary rounded-xl w-9 font-bold text-xs uppercase">
                                                                {p.user ? p.user.name.charAt(0) : p.external_name.charAt(0)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black leading-none mb-1">{p.user?.name || p.external_name}</p>
                                                            <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest">{p.role_in_meeting || 'Asistente'}</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => deleteParticipant(p.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-error/40 hover:text-error"><Trash2 size={14} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="p-6 text-center opacity-30 font-bold text-xs">No hay participantes invitados.</p>
                                    )}
                                </div>

                                <ResourceFolder
                                    title="Documentos"
                                    type="App\Models\Meeting"
                                    id={meeting.id}
                                    attachments={meeting.attachments}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'durante' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bento-card">
                                <h3 className="text-xl font-black mb-8 flex items-center gap-2"><PlayCircle className="text-secondary" /> Control de Asistencia</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {meeting.participants.map(p => (
                                        <div key={p.id} className="p-4 rounded-3xl bg-base-200 border border-base-300 flex flex-col gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="avatar placeholder">
                                                    <div className="bg-base-300 rounded-xl w-10 text-xs font-bold">{p.user?.name?.charAt(0) || p.external_name?.charAt(0)}</div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black">{p.user?.name || p.external_name}</p>
                                                    <p className="text-[10px] opacity-40 uppercase font-black">{p.attendance_status || 'Sin marcar'}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => updateAttendance(p.id, 'presente')} className={`flex-1 btn btn-sm rounded-xl border-none font-bold text-[10px] tracking-widest ${p.attendance_status === 'presente' ? 'bg-success text-success-content shadow-lg shadow-success/20' : 'bg-base-100 opacity-40 hover:opacity-100'}`}>PRESENTE</button>
                                                <button onClick={() => updateAttendance(p.id, 'ausente')} className={`flex-1 btn btn-sm rounded-xl border-none font-bold text-[10px] tracking-widest ${p.attendance_status === 'ausente' ? 'bg-error text-error-content shadow-lg shadow-error/20' : 'bg-base-100 opacity-40 hover:opacity-100'}`}>AUSENTE</button>
                                                <button onClick={() => updateAttendance(p.id, 'justificado')} className={`flex-1 btn btn-sm rounded-xl border-none font-bold text-[10px] tracking-widest ${p.attendance_status === 'justificado' ? 'bg-warning text-warning-content shadow-lg shadow-warning/20' : 'bg-base-100 opacity-40 hover:opacity-100'}`}>JUSTIFICADO</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="lg:col-span-1 bento-card bg-primary text-primary-content overflow-hidden relative">
                                <div className="absolute right-0 bottom-0 opacity-10"><PlayCircle size={200} /></div>
                                <div className="relative z-10">
                                    <h3 className="text-xl font-black mb-4 text-white">¡En Marcha!</h3>
                                    <p className="text-sm font-bold text-white mb-8 leading-relaxed">Marca la asistencia mientras el equipo desarrolla los puntos de la agenda.</p>
                                    <div className="p-4 bg-white/20 rounded-2xl border border-white/30">
                                        <p className="text-xs font-black flex items-center gap-2 text-white"><Info size={14} /> Tip: Puedes agregar minutas y acuerdos una vez finalizada la sesión.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'despues' && (
                        <div className="flex flex-col items-center justify-center py-10">
                            {meeting.minute ? (
                                <div className="bento-card max-w-2xl w-full text-center py-16 px-10 border-success/30 bg-success/5">
                                    <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center text-success-content mx-auto mb-8 shadow-2xl shadow-success/30">
                                        <CheckCircle size={48} strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-3xl font-black tracking-tight mb-2 text-success">Minuta Publicada</h3>
                                    <p className="text-base-content/60 font-medium mb-10">El acta oficial ha sido enviada y los acuerdos están activos.</p>
                                    <div className="flex gap-4 justify-center">
                                        <Link href={route('minutes.show', meeting.minute.id)} className="btn btn-success btn-lg rounded-3xl font-black px-12 uppercase tracking-widest text-white shadow-xl shadow-success/20">
                                            Ver Documento Oficial <ChevronRight />
                                        </Link>
                                        <a href={route('meetings.export', meeting.id)} target="_blank" className="btn btn-outline btn-lg rounded-3xl font-black px-8 uppercase tracking-widest border-success text-success hover:bg-success hover:border-success">
                                            <Download size={20} /> PDF
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="bento-card max-w-2xl w-full text-center py-16 px-10 border-primary/30 bg-primary/5">
                                    <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-content mx-auto mb-8 shadow-2xl shadow-primary/30">
                                        <FileText size={48} strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-3xl font-black tracking-tight mb-2 text-primary">Cerrar Sesión</h3>
                                    <p className="text-base-content/60 font-medium mb-10">Genera el acta final con los compromisos y decisiones tomadas hoy.</p>
                                    <Link href={route('meetings.minute.create', meeting.id)} className="btn btn-primary btn-lg rounded-3xl font-black px-12 uppercase tracking-widest shadow-xl shadow-primary/20">
                                        Preparar Minuta <ChevronRight />
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Modals Refined */}
            <dialog className={`modal backdrop-blur-md ${agendaModal ? 'modal-open' : ''}`}>
                <div className="modal-box rounded-3xl border border-base-200 p-8 shadow-2xl">
                    <h3 className="font-black text-2xl mb-2 tracking-tight">Nuevo Punto de Agenda</h3>
                    <p className="text-sm font-medium opacity-40 mb-8">Define de qué vamos a hablar.</p>
                    <form onSubmit={addAgendaItem} className="space-y-6">
                        <div className="form-control">
                            <label className="label"><span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50">Título del tema</span></label>
                            <input type="text" className="input input-bordered rounded-2xl bg-base-200 border-none focus:ring-primary/20 transition-all font-bold w-full" value={agendaForm.data.title} onChange={e => agendaForm.setData('title', e.target.value)} required />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50">Descripción / Objetivo</span></label>
                            <textarea
                                className="textarea textarea-bordered rounded-2xl w-full h-32"
                                placeholder="Escribe el objetivo de este punto..."
                                value={agendaForm.data.description}
                                onChange={e => agendaForm.setData('description', e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50">Speaker</span></label>
                            <select className="select select-bordered rounded-2xl bg-base-200 border-none font-bold w-full" value={agendaForm.data.speaker_id} onChange={e => agendaForm.setData('speaker_id', e.target.value)}>
                                <option value="">Por definir</option>
                                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50">Duración (Min)</span></label>
                            <input type="number" className="input input-bordered rounded-2xl bg-base-200 border-none font-bold w-full" value={agendaForm.data.estimated_time_min} onChange={e => agendaForm.setData('estimated_time_min', e.target.value)} required />
                        </div>
                        <div className="modal-action gap-3">
                            <button type="button" className="btn btn-ghost rounded-2xl font-black text-[10px] uppercase tracking-widest" onClick={() => setAgendaModal(false)}>Cerrar</button>
                            <button type="submit" className="btn btn-primary rounded-2xl px-8 font-black text-[10px] uppercase tracking-widest" disabled={agendaForm.processing}>Guardar Tema</button>
                        </div>
                    </form>
                </div>
            </dialog>

            <dialog className={`modal backdrop-blur-md ${participantModal ? 'modal-open' : ''}`}>
                <div className="modal-box rounded-3xl border border-base-200 p-8 shadow-2xl">
                    <h3 className="font-black text-2xl mb-2 tracking-tight">Agregar Invitado</h3>
                    <p className="text-sm font-medium opacity-40 mb-8">Internos o colaboradores externos.</p>
                    <form onSubmit={addParticipant} className="space-y-6">
                        <div className="form-control">
                            <label className="label"><span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50">Usuario Interno</span></label>
                            <select className="select select-bordered rounded-2xl bg-base-200 border-none font-bold" value={participantForm.data.user_id} onChange={e => participantForm.setData('user_id', e.target.value)}>
                                <option value="">Externo...</option>
                                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50">O Nombre Externo</span></label>
                            <input type="text" className="input input-bordered rounded-2xl bg-base-200 border-none font-bold" value={participantForm.data.external_name} onChange={e => participantForm.setData('external_name', e.target.value)} />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50">Rol / Cargo</span></label>
                            <input type="text" className="input input-bordered rounded-2xl bg-base-200 border-none font-bold" placeholder="Ej: Invitado Especial" value={participantForm.data.role_in_meeting} onChange={e => participantForm.setData('role_in_meeting', e.target.value)} />
                        </div>
                        <div className="modal-action gap-3">
                            <button type="button" className="btn btn-ghost rounded-2xl font-black text-[10px] uppercase tracking-widest" onClick={() => setParticipantModal(false)}>Cerrar</button>
                            <button type="submit" className="btn btn-primary rounded-2xl px-8 font-black text-[10px] uppercase tracking-widest" disabled={participantForm.processing}>Agregar Invitado</button>
                        </div>
                    </form>
                </div>
            </dialog>

        </AuthenticatedLayout>
    );
}
