import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    ClipboardCheck,
    ArrowUpRight,
    Users,
    CircleDashed,
    Clock,
    ChevronRight,
    TrendingUp,
    History
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard({ auth, stats, upcomingMeetings, recentAgreements, departmentStats }) {
    const getResponsibleLabel = (agreement) => {
        if (agreement.responsibles?.length) {
            return agreement.responsibles.map((responsible) => responsible.name).join(', ');
        }

        return agreement.responsible?.name || 'Sin responsable';
    };

    return (
        <AuthenticatedLayout header="Panel de Control">
            <Head title="Dashboard" />

            <div className="space-y-10 pb-20">
                {/* Saludo y Resumen Rápido */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-base-content tracking-tight">¡Hola, {auth.user.name}!</h2>
                        <p className="text-base-content/50 font-medium">Aquí tienes un resumen de la actividad de hoy.</p>
                    </div>
                    <div className="text-sm font-bold opacity-40 uppercase tracking-widest">{new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                </div>

                {/* Bento Grid: Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <motion.div whileHover={{ y: -5 }} className="md:col-span-1 bento-card border-l-4 border-l-secondary">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-secondary/10 rounded-xl text-secondary">
                                <Calendar size={24} strokeWidth={2.5} />
                            </div>
                            <span className="badge badge-secondary badge-xs font-black">HOY</span>
                        </div>
                        <p className="text-4xl font-black tracking-tighter">{stats.meetingsToday}</p>
                        <p className="text-[10px] uppercase font-extrabold tracking-widest opacity-40 mt-1">Reuniones agendadas</p>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="md:col-span-1 bento-card border-l-4 border-l-primary">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-primary/10 rounded-xl text-primary font-bold">
                                <ClipboardCheck size={24} strokeWidth={2.5} />
                            </div>
                        </div>
                        <p className="text-4xl font-black tracking-tighter">{stats.pendingAgreements}</p>
                        <p className="text-[10px] uppercase font-extrabold tracking-widest opacity-40 mt-1">Acuerdos pendientes equipo</p>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="md:col-span-1 bento-card border-l-4 border-l-accent">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-accent/10 rounded-xl text-accent">
                                <Users size={24} strokeWidth={2.5} />
                            </div>
                        </div>
                        <p className="text-4xl font-black tracking-tighter">{stats.myPending}</p>
                        <p className="text-[10px] uppercase font-extrabold tracking-widest opacity-40 mt-1">Acuerdos bajo mi responsabilidad</p>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="md:col-span-1 bento-card bg-gradient-to-br from-primary to-secondary text-primary-content border-none overflow-hidden relative group">
                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform">
                            <TrendingUp size={120} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-4">Cumplimiento Mes</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-5xl font-black tracking-tighter">{stats.completedMonthly}</p>
                                <span className="text-xs font-bold opacity-80">Logrados</span>
                            </div>
                            <div className="mt-4 flex gap-1">
                                <Link href={route('agreements.index')} className="text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1">
                                    Ver reportes <ArrowUpRight size={10} />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Spectacular Department Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1 bento-card border-none bg-primary/5 p-8 flex flex-col justify-center text-center">
                        <div className="relative inline-block mx-auto mb-6">
                            <div className="w-24 h-24 rounded-full border-8 border-primary/10 flex items-center justify-center">
                                <p className="text-2xl font-black text-primary">
                                    {Math.round((stats.completedMonthly / (stats.pendingAgreements + stats.completedMonthly || 1)) * 100)}%
                                </p>
                            </div>
                            <div className="absolute inset-0 w-full h-full animate-pulse-slow">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary/20" strokeDasharray="283" strokeDashoffset="0" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-widest mb-1">KPI Global</h3>
                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Eficiencia en acuerdos</p>
                    </div>

                    <div className="lg:col-span-3 bento-card">
                        <div className="flex justify-between items-center mb-6 px-2">
                            <h3 className="font-black text-lg uppercase tracking-tighter flex items-center gap-2">
                                <Users size={20} className="text-primary" /> Cumplimiento por Área
                            </h3>
                            <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">Pendientes / Total</span>
                        </div>
                        <div className="space-y-6">
                            {departmentStats.map((dept) => (
                                <div key={dept.id} className="space-y-2 group cursor-default">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-black uppercase tracking-widest group-hover:text-primary transition-colors">{dept.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${dept.pending_count > 5 ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}`}>
                                                {dept.pending_count} PENDIENTES
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-4 bg-base-200 rounded-2xl overflow-hidden relative shadow-inner">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.max(15, 100 - (dept.pending_count * 12))}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className={`h-full bg-gradient-to-r ${dept.pending_count > 5 ? 'from-error/60 to-error' : 'from-primary/60 to-primary'} rounded-2xl relative shadow-lg shadow-primary/20`}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-shimmer scale-x-150 origin-left"></div>
                                        </motion.div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Próximas Reuniones */}
                    <div className="lg:col-span-2 bento-card p-0 overflow-hidden">
                        <div className="p-6 border-b border-base-200 flex justify-between items-center">
                            <h3 className="font-black text-lg flex items-center gap-2">
                                <CircleDashed size={20} className="text-primary animate-spin-slow" />
                                Próximas Reuniones
                            </h3>
                            <Link href={route('meetings.index')} className="text-xs font-bold text-primary hover:underline">Ver todas</Link>
                        </div>
                        <div className="divide-y divide-base-200">
                            {upcomingMeetings.length > 0 ? upcomingMeetings.map((meeting) => (
                                <div key={meeting.id} className="p-6 flex items-center gap-6 hover:bg-base-200/50 transition-colors group">
                                    <div className="hidden sm:flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-base-200 font-black group-hover:bg-primary group-hover:text-primary-content transition-colors transition-all duration-300">
                                        <span className="text-[10px] uppercase opacity-50">{new Date(meeting.date).toLocaleDateString('es-CL', { month: 'short' })}</span>
                                        <span className="text-xl -mt-1">{new Date(meeting.date).getDate()}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-base group-hover:text-primary transition-colors">{meeting.subject}</h4>
                                        <div className="flex items-center gap-4 mt-1 text-xs font-bold opacity-40 uppercase tracking-widest">
                                            <span className="flex items-center gap-1"><Clock size={12} /> {meeting.start_time.substring(0, 5)} hrs</span>
                                            <span>{meeting.department?.name}</span>
                                        </div>
                                    </div>
                                    <Link href={route('meetings.show', meeting.id)} className="btn btn-ghost btn-circle opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight />
                                    </Link>
                                </div>
                            )) : (
                                <div className="p-10 text-center opacity-40 italic text-sm font-medium">No hay reuniones programadas.</div>
                            )}
                        </div>
                    </div>

                    {/* Acuerdos Recientes */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="flex justify-between items-center mb-2 px-2">
                            <h3 className="font-black text-lg flex items-center gap-2 uppercase tracking-tighter"><History size={20} className="text-secondary" /> Actividad</h3>
                        </div>
                        {recentAgreements.length > 0 ? recentAgreements.map((agreement) => (
                            <Link key={agreement.id} href={route('agreements.show', agreement.id)} className="block bento-card p-6 hover:translate-x-1 group transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">{agreement.subject}</h4>
                                    <span className={`w-2 h-2 rounded-full ${agreement.status === 'realizado' ? 'bg-success' : 'bg-primary'}`}></span>
                                </div>
                                <div className="flex justify-between items-center text-[9px] font-black uppercase opacity-30">
                                    <span>{getResponsibleLabel(agreement)}</span>
                                    <span>{agreement.commitment_date}</span>
                                </div>
                            </Link>
                        )) : (
                            <div className="bento-card py-10 text-center opacity-40 italic text-sm">Sin actividad reciente.</div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
