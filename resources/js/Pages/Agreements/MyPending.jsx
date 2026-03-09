import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    AlertTriangle,
    Activity,
    ChevronRight,
    Search,
    Inbox,
    Calendar,
    Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function MyPending({ auth, agreements, filters }) {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'realizado': return { color: 'success', icon: CheckCircle2, progress: 100 };
            case 'atrasado': return { color: 'error', icon: AlertTriangle, progress: 85 };
            case 'en proceso': return { color: 'info', icon: Activity, progress: 50 };
            default: return { color: 'primary', icon: Clock, progress: 10 };
        }
    };

    const onFilterChange = (status) => {
        router.get(route('agreements.mypending'), { status }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout header="Mis Acuerdos Pendientes">
            <Head title="Mis Pendientes" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h2 className="text-3xl font-black text-base-content tracking-tight">Mis Compromisos</h2>
                    <p className="text-base-content/50 font-medium text-sm">Gestiona tus tareas y reporta tus avances.</p>
                </div>
                <div className="flex bg-base-200 p-1 rounded-2xl gap-1">
                    {['', 'pendiente', 'en proceso', 'atrasado'].map((s) => (
                        <button
                            key={s}
                            onClick={() => onFilterChange(s)}
                            className={`btn btn-sm rounded-xl border-none font-black text-[10px] uppercase tracking-widest px-4 ${filters.status === s ? 'btn-primary shadow-lg shadow-primary/20' : 'btn-ghost opacity-50'}`}
                        >
                            {s || 'TODOS'}
                        </button>
                    ))}
                </div>
            </div>

            {agreements.data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {agreements.data.map((agreement, idx) => {
                        const style = getStatusStyle(agreement.status);
                        return (
                            <motion.div
                                key={agreement.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group bento-card hover:border-primary/30 cursor-pointer"
                                onClick={() => router.get(route('agreements.show', agreement.id))}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 rounded-2xl bg-${style.color}/10 text-${style.color}`}>
                                        <style.icon size={24} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">
                                        {agreement.commitment_date}
                                    </span>
                                </div>
                                <h3 className="font-black text-lg mb-2 leading-tight group-hover:text-primary transition-colors">
                                    {agreement.subject}
                                </h3>
                                <div className="flex flex-col gap-2 mb-6">
                                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest flex items-center gap-2">
                                        <Briefcase size={12} /> {agreement.department?.name}
                                    </span>
                                    <span className="text-[10px] font-bold text-primary flex items-center gap-2">
                                        <Calendar size={12} /> {agreement.minute?.meeting?.code}
                                    </span>
                                </div>

                                <div className="space-y-2 mt-auto">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter opacity-40">
                                        <span>Progreso</span>
                                        <span>{style.progress}%</span>
                                    </div>
                                    <progress className={`progress progress-${style.color} w-full h-2 rounded-full`} value={style.progress} max="100"></progress>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-32 text-center"
                >
                    <div className="bg-primary/5 p-10 rounded-full mb-8">
                        <Inbox size={80} strokeWidth={0.5} className="text-primary/20" />
                    </div>
                    <h3 className="text-2xl font-black mb-2">¡Todo al día!</h3>
                    <p className="max-w-xs text-base-content/40 font-medium">No tienes acuerdos pendientes en este estado. ¡Excelente trabajo!</p>
                </motion.div>
            )}

            {agreements.links.length > 3 && (
                <div className="mt-12 flex justify-center">
                    <div className="join bg-base-100 shadow-sm border border-base-200">
                        {agreements.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url}
                                className={`join-item btn btn-md hover:bg-primary hover:text-white transition-colors border-none ${link.active ? 'btn-primary' : 'bg-transparent text-base-content/50'} ${!link.url ? 'btn-disabled opacity-30' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
