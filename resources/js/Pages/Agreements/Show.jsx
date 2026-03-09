import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import ResourceFolder from '@/Components/ResourceFolder';
import {
    Calendar,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Plus,
    User,
    Building2,
    AlertCircle,
    CheckCircle,
    LayoutDashboard,
    ArrowRight,
    ArrowLeft,
    History as HistoryIcon,
    Activity,
    Briefcase,
    FileText,
    Save,
    MessageCircle
} from 'lucide-react';

export default function Show({ auth, agreement }) {
    const responsibles = agreement.responsibles?.length
        ? agreement.responsibles
        : (agreement.responsible ? [agreement.responsible] : []);

    const { data, setData, post, processing, errors, reset } = useForm({
        notes: '',
        status_after: agreement.status,
        progress_percentage: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('agreements.updates.store', agreement.id), {
            onSuccess: () => {
                reset('notes', 'progress_percentage');
            }
        });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'realizado': return { color: 'success', icon: CheckCircle2, progress: 100 };
            case 'atrasado': return { color: 'error', icon: AlertTriangle, progress: 90 };
            case 'en proceso': return { color: 'info', icon: Activity, progress: 60 };
            default: return { color: 'primary', icon: Clock, progress: 15 };
        }
    };

    const statusStyle = getStatusStyle(agreement.status);

    return (
        <AuthenticatedLayout header="Seguimiento de Acuerdo">
            <Head title={`Acuerdo: ${agreement.subject}`} />

            <div className="flex justify-between items-center mb-10">
                <Link href={route('agreements.index')} className="btn btn-ghost group hover:bg-transparent">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> <span className="font-bold opacity-50 group-hover:opacity-100 transition-opacity">Listado Maestro</span>
                </Link>
                <div className={`badge badge-lg border-2 border-${statusStyle.color} text-${statusStyle.color} font-black capitalize px-6 py-5 gap-2 bg-transparent`}>
                    <statusStyle.icon size={16} /> {agreement.status}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">

                {/* Detalles del Acuerdo - Bento Card Principal */}
                <div className="lg:col-span-2 space-y-8">

                    <div className="bento-card overflow-hidden relative">
                        {/* Background Decoration */}
                        <div className={`absolute -right-10 -top-10 text-${statusStyle.color}/5 grayscale opacity-20`}>
                            <statusStyle.icon size={250} />
                        </div>

                        <div className="relative z-10">
                            <span className="text-[10px] uppercase font-black tracking-widest text-primary opacity-60 mb-2 block">Acuerdo de Reunión</span>
                            <h2 className="text-3xl font-black text-base-content mb-8 tracking-tight">{agreement.subject}</h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Responsable</p>
                                    <div className="flex items-center gap-2 font-bold text-sm flex-wrap">
                                        {responsibles.length > 0 ? (
                                            responsibles.map((responsible) => (
                                                <span key={responsible.id} className="badge badge-sm badge-outline border-primary/30 text-primary font-bold">
                                                    {responsible.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="opacity-40">Sin responsable</span>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Fecha Límite</p>
                                    <div className="flex items-center gap-2 font-bold text-sm text-error">
                                        <Calendar size={14} /> {agreement.commitment_date}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Área</p>
                                    <div className="flex items-center gap-2 font-bold text-sm opacity-80">
                                        <Briefcase size={14} /> {agreement.department?.name}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Acta Origen</p>
                                    <Link href={route('meetings.show', agreement.minute?.meeting_id)} className="flex items-center gap-2 font-bold text-sm text-primary hover:underline">
                                        <FileText size={14} /> {agreement.minute?.meeting?.code}
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-10 pt-10 border-t border-base-200">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Progreso Estimado</span>
                                    <span className={`text-sm font-black text-${statusStyle.color}`}>{statusStyle.progress}%</span>
                                </div>
                                <progress className={`progress progress-${statusStyle.color} h-3 shadow-sm`} value={statusStyle.progress} max="100"></progress>
                            </div>
                        </div>
                    </div>

                    {/* Historial de Seguimiento Estilo Timeline */}
                    <div className="bento-card relative">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-black flex items-center gap-3">
                                <HistoryIcon size={24} className="text-secondary" /> Historial de Seguimiento
                            </h3>
                            <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">{agreement.updates?.length || 0} Eventos</span>
                        </div>

                        {agreement.updates?.length > 0 ? (
                            <div className="space-y-12 relative before:content-[''] before:absolute before:left-[1.35rem] before:top-2 before:bottom-2 before:w-[2px] before:bg-base-200">
                                {agreement.updates.map((update, index) => {
                                    const upStatus = getStatusStyle(update.status_changed_to); // Updated from status_after
                                    return (
                                        <motion.div
                                            key={update.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative pl-14"
                                        >
                                            <div className={`absolute left-0 top-1 w-11 h-11 rounded-2xl bg-base-100 border-2 border-${upStatus.color} shadow-lg flex items-center justify-center text-${upStatus.color} z-10 transition-transform hover:scale-110`}>
                                                <upStatus.icon size={20} strokeWidth={2.5} />
                                            </div>
                                            <div className="bg-base-200/50 p-6 rounded-3xl border border-base-200 hover:border-primary/20 transition-all">
                                                <div className="flex flex-col sm:flex-row justify-between items-start md:items-center mb-4 gap-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs font-bold">
                                                            {update.creator?.name?.charAt(0)} {/* Updated from user */}
                                                        </div>
                                                        <span className="font-black text-sm">{update.creator?.name}</span>
                                                    </div>
                                                    <span className="text-[10px] font-semibold opacity-40 uppercase tracking-wider bg-base-300 px-3 py-1 rounded-full">
                                                        {new Date(update.created_at).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium leading-relaxed opacity-70 mb-4">{update.comment}</p> {/* Updated from notes */}
                                                <div className="flex items-center gap-4">
                                                    <span className={`text-[10px] font-black uppercase tracking-tighter text-${upStatus.color}`}>Cambió a {update.status_changed_to} • {update.progress_percentage}% Avance</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center opacity-30 grayscale">
                                <HistoryIcon size={64} strokeWidth={1} className="mb-4" />
                                <p className="font-black uppercase text-[10px] tracking-[0.2em]">Esperando primer avance</p>
                            </div>
                        )}
                    </div>

                </div>

                {/* Sidebar Registro - Bento Card Flotante */}
                <div className="space-y-6">
                    {/* Documentos de Evidencia */}


                    <div className="bento-card sticky top-28 bg-primary/5 border-primary/20 backdrop-blur-md">
                        <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                            <Plus size={24} className="text-primary" /> Nuevo Avance
                        </h3>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50">Comentarios del Progreso</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-40 rounded-2xl bg-base-100 border-base-300 focus:border-primary/50 text-sm font-medium"
                                    placeholder="Describe qué has avanzado o qué problemas surgieron..."
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    required
                                ></textarea>
                                {errors.notes && <span className="text-error text-[10px] font-black uppercase mt-1 px-2">{errors.notes}</span>}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50">Porcentaje de Avance (%)</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="input input-bordered rounded-2xl bg-base-100 border-base-300 font-bold"
                                    value={data.progress_percentage || ''}
                                    onChange={e => setData('progress_percentage', e.target.value)}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50">Próximo Estado</span>
                                </label>
                                <select
                                    className="select select-bordered rounded-2xl bg-base-100 border-base-300 focus:border-primary/50 font-bold"
                                    value={data.status_after}
                                    onChange={e => setData('status_after', e.target.value)}
                                    required
                                >
                                    <option value="pendiente">Pendiente (Sin cambios)</option>
                                    <option value="en proceso">En proceso</option>
                                    <option value="realizado">Realizado / Finalizado</option>
                                    <option value="atrasado">Atrasado / Con problemas</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-primary btn-block rounded-2xl shadow-xl shadow-primary/30 font-black uppercase tracking-widest h-14" disabled={processing}>
                                {processing ? <span className="loading loading-spinner"></span> : <Save size={20} />}
                                Guardar Seguimiento
                            </button>
                        </form>
                    </div>
                         <ResourceFolder
                        title="Evidencias"
                        type="App\Models\Agreement"
                        id={agreement.id}
                        attachments={agreement.attachments}
                    />
                    <div className="bento-card p-6 flex items-center gap-4 bg-secondary/5 border-secondary/20">
                        <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
                            <MessageCircle size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Ayuda</p>
                            <p className="text-[11px] font-bold opacity-70">¿Tienes dudas con este acuerdo? Contacta al moderador de la reunión.</p>
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
