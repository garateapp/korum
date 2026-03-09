import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Search,
    Filter,
    ChevronRight,
    Clock,
    User,
    Briefcase,
    Plus,
    CircleDashed,
    CheckCircle2,
    AlertCircle,
    Inbox
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Index({ auth, agreements, filters, users, departments }) {
    const getResponsibleLabel = (agreement) => {
        if (agreement.responsibles?.length) {
            return agreement.responsibles.map((responsible) => responsible.name).join(', ');
        }

        return agreement.responsible?.name || 'Sin responsable';
    };

    const onFilterChange = (key, value) => {
        router.get(route('agreements.index'), {
            ...filters,
            [key]: value,
        }, { preserveState: true });
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'realizado': return { color: 'success', icon: CheckCircle2, progress: 100 };
            case 'atrasado': return { color: 'error', icon: AlertCircle, progress: 80 };
            case 'en proceso': return { color: 'info', icon: CircleDashed, progress: 45 };
            default: return { color: 'ghost', icon: Clock, progress: 10 };
        }
    };

    return (
        <AuthenticatedLayout header="Seguimiento de Acuerdos">
            <Head title="Acuerdos y Tareas" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h2 className="text-3xl font-black text-base-content tracking-tight">Panel de Acuerdos</h2>
                    <p className="text-base-content/50 font-medium">Gestiona y monitorea los compromisos de tu equipo.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn btn-primary shadow-xl shadow-primary/20">
                        <Plus size={20} /> Nuevo Acuerdo
                    </button>
                </div>
            </div>

            {/* Filtros Bento-Style */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="md:col-span-2 bento-card flex items-center gap-4 bg-white/50 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-primary/5 transition-all">
                    <Search size={18} className="opacity-30" />
                    <input
                        type="text"
                        placeholder="BUSCAR ACUERDO..."
                        className="bg-transparent border-none focus:ring-0 p-0 text-[10px] font-black uppercase tracking-widest w-full placeholder:text-base-content/20"
                        value={filters.search || ''}
                        onChange={e => onFilterChange('search', e.target.value)}
                    />
                </div>
                <div className="md:col-span-1 bento-card flex flex-col justify-center">
                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-40 mb-2 flex items-center gap-2">
                        <Filter size={12} /> Estado
                    </label>
                    <select
                        className="select select-ghost select-sm w-full font-bold text-sm focus:bg-transparent"
                        value={filters.status || ''}
                        onChange={e => onFilterChange('status', e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="en proceso">En proceso</option>
                        <option value="realizado">Realizado</option>
                        <option value="atrasado">Atrasado</option>
                    </select>
                </div>
                <div className="md:col-span-1 bento-card flex flex-col justify-center">
                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-40 mb-2 flex items-center gap-2">
                        <User size={12} /> Responsable
                    </label>
                    <select
                        className="select select-ghost select-sm w-full font-bold text-sm focus:bg-transparent"
                        value={filters.responsible_id || ''}
                        onChange={e => onFilterChange('responsible_id', e.target.value)}
                    >
                        <option value="">Todos</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                </div>
                <div className="md:col-span-1 flex items-center justify-center p-4">
                    <button
                        onClick={() => router.get(route('agreements.index'))}
                        className="btn btn-ghost btn-sm text-xs font-bold opacity-40 hover:opacity-100"
                    >
                        Limpiar
                    </button>
                </div>
            </div>

            {/* Listado Principal */}
            {agreements.data.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {agreements.data.map((agreement, idx) => {
                        const status = getStatusInfo(agreement.status);
                        return (
                            <motion.div
                                key={agreement.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group bento-card hover:translate-x-1 cursor-pointer"
                                onClick={() => router.get(route('agreements.show', agreement.id))}
                            >
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                    <div className={`p-3 rounded-2xl bg-${status.color}/10 text-${status.color}`}>
                                        <status.icon size={28} strokeWidth={2} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                                                {agreement.subject}
                                            </h3>
                                            <span className={`badge badge-sm badge-${status.color} font-bold capitalize`}>
                                                {agreement.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-xs font-bold opacity-40 uppercase tracking-wider">
                                            <span className="flex items-center gap-1"><User size={12} /> {getResponsibleLabel(agreement)}</span>
                                            <span className="flex items-center gap-1"><Briefcase size={12} /> {agreement.department?.name}</span>
                                            <span className="flex items-center gap-1 text-primary"><Search size={12} /> Ref: {agreement.minute?.meeting?.code}</span>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-64 space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter opacity-40">
                                            <span>Progreso</span>
                                            <span>{status.progress}%</span>
                                        </div>
                                        <progress
                                            className={`progress progress-${status.color} w-full h-2 rounded-full`}
                                            value={status.progress}
                                            max="100"
                                        ></progress>
                                        <div className="flex items-center justify-between text-[10px] font-bold">
                                            <span className="opacity-40">Límite:</span>
                                            <span className={agreement.status === 'atrasado' ? 'text-error' : 'opacity-60'}>
                                                {agreement.commitment_date}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="btn btn-circle btn-ghost">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                /* Empty State Minimalista */
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-24 text-center"
                >
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                        <Inbox size={120} strokeWidth={0.5} className="relative text-primary/20" />
                        <CircleDashed size={40} className="absolute -bottom-2 -right-2 text-accent animate-spin-slow" />
                    </div>
                    <h3 className="text-2xl font-black mb-2">Todo en orden por aquí</h3>
                    <p className="max-w-xs text-base-content/40 font-medium">
                        No hay acuerdos pendientes que coincidan con tu búsqueda. ¡Buen trabajo manteniendo la lista limpia!
                    </p>
                    <button
                        onClick={() => router.get(route('agreements.index'))}
                        className="btn btn-outline btn-sm mt-8 border-dashed"
                    >
                        Ver todos los acuerdos
                    </button>
                </motion.div>
            )}

            {/* Paginación Refinada */}
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
