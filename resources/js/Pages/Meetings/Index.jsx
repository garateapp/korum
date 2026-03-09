import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    IconPlus,
    IconCalendar,
    IconMapPin,
    IconVideo,
    IconDotsVertical,
    IconEye,
    IconEdit,
    IconList,
    IconChevronLeft,
    IconChevronRight,
    IconFilter,
    IconX,
    IconBrandGoogle,
    IconRefresh,
    IconSearch
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

export default function Index({ auth, meetings, filters, googleCalendar }) {
    const [viewMode, setViewMode] = useState(filters.view || 'list');
    const [showCancelled, setShowCancelled] = useState(filters.show_cancelled === 'true');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'date');
    const [sortDir, setSortDir] = useState(filters.sort_dir || 'desc');
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [syncingGoogle, setSyncingGoogle] = useState(false);

    const visitWithFilters = (overrides = {}) => {
        router.get(route('meetings.index'), {
            ...filters,
            search: searchTerm,
            sort_by: sortBy,
            sort_dir: sortDir,
            show_cancelled: showCancelled,
            view: viewMode,
            ...overrides,
        }, { preserveState: true, preserveScroll: true });
    };

    const toggleCancelled = () => {
        const newValue = !showCancelled;
        setShowCancelled(newValue);
        visitWithFilters({ show_cancelled: newValue });
    };

    const switchView = (mode) => {
        setViewMode(mode);
        visitWithFilters({ view: mode });
    };

    const submitSearch = (e) => {
        e.preventDefault();
        visitWithFilters({ search: searchTerm, page: 1 });
    };

    const clearSearch = () => {
        setSearchTerm('');
        visitWithFilters({ search: '', page: 1 });
    };

    const updateSort = (newSortBy, newSortDir = sortDir) => {
        setSortBy(newSortBy);
        setSortDir(newSortDir);
        visitWithFilters({ sort_by: newSortBy, sort_dir: newSortDir, page: 1 });
    };

    const syncGoogleCalendar = () => {
        router.post(route('integrations.google-calendar.sync'), {}, {
            preserveScroll: true,
            onStart: () => setSyncingGoogle(true),
            onFinish: () => setSyncingGoogle(false),
        });
    };

    // Calendar Logic
    const calendarDays = useMemo(() => {
        const startOfMonth = currentDate.startOf('month');
        const endOfMonth = currentDate.endOf('month');
        const startDate = startOfMonth.startOf('week');
        const endDate = endOfMonth.endOf('week');

        const days = [];
        let day = startDate;

        while (day.isBefore(endDate)) {
            days.push(day);
            day = day.add(1, 'day');
        }
        return days;
    }, [currentDate]);

    const getMeetingsForDay = (date) => {
        const dateStr = date.format('YYYY-MM-DD');
        // If it's list view, meetings is paginated object. If calendar, it might be a flat array depending on controller.
        // In our updated controller, calendar view returns a flat collection.
        const data = Array.isArray(meetings) ? meetings : meetings.data;
        return data.filter(m => m.date === dateStr);
    };
    return (
        <AuthenticatedLayout header="Reuniones">
            <Head title="Reuniones" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-base-content tracking-tight">Gestión de Reuniones</h2>
                    <p className="text-base-content/50 font-bold text-xs uppercase tracking-widest mt-1">
                        {viewMode === 'list' ? 'Vista de Listado Detallado' : `Calendario • ${currentDate.format('MMMM YYYY')}`}
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-base-200">
                    <button
                        onClick={() => switchView('list')}
                        className={`btn btn-sm rounded-xl gap-2 ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
                    >
                        <IconList size={18} /> <span className="hidden sm:inline">Lista</span>
                    </button>
                    <button
                        onClick={() => switchView('calendar')}
                        className={`btn btn-sm rounded-xl gap-2 ${viewMode === 'calendar' ? 'btn-primary' : 'btn-ghost'}`}
                    >
                        <IconCalendar size={18} /> <span className="hidden sm:inline">Calendario</span>
                    </button>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="form-control">
                        <label className="label cursor-pointer gap-3 bg-white px-4 py-2 rounded-2xl border border-base-200 shadow-sm hover:bg-base-50 transition-colors">
                            <span className="text-[10px] font-black uppercase opacity-60">Mostrar Canceladas</span>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary toggle-sm"
                                checked={showCancelled}
                                onChange={toggleCancelled}
                            />
                        </label>
                    </div>

                    {googleCalendar?.connected ? (
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-base-200 shadow-sm">
                            <button
                                onClick={syncGoogleCalendar}
                                disabled={syncingGoogle}
                                className="btn btn-sm btn-outline btn-primary rounded-xl gap-2"
                            >
                                <IconRefresh size={16} className={syncingGoogle ? 'animate-spin' : ''} />
                                <span>{syncingGoogle ? 'Sincronizando...' : 'Sincronizar Google'}</span>
                            </button>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 whitespace-nowrap">
                                {googleCalendar.last_synced_at
                                    ? `Última sync: ${dayjs(googleCalendar.last_synced_at).format('DD/MM HH:mm')}`
                                    : 'Conectado'}
                            </span>
                        </div>
                    ) : (
                        <a href={route('integrations.google-calendar.force-consent', { return_to: '/meetings' })} className="btn btn-sm btn-outline rounded-2xl gap-2">
                            <IconBrandGoogle size={16} />
                            <span className="font-black text-[10px] uppercase tracking-widest">Forzar Permiso Google</span>
                        </a>
                    )}

                    <Link href={route('meetings.create')} className="btn btn-primary rounded-2xl shadow-lg shadow-primary/20 gap-2 flex-1 md:flex-none">
                        <IconPlus size={20} /> <span className="font-black italic">NUEVA REUNIÓN</span>
                    </Link>
                </div>
            </div>

            <div className="mb-6 flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                <form onSubmit={submitSearch} className="flex-1 flex items-center gap-2 bg-white border border-base-200 rounded-2xl p-2 shadow-sm">
                    <IconSearch size={18} className="opacity-40 ml-1" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por código, asunto o descripción..."
                        className="input input-sm input-ghost w-full focus:outline-none"
                    />
                    {searchTerm && (
                        <button type="button" onClick={clearSearch} className="btn btn-ghost btn-sm btn-circle" title="Limpiar búsqueda">
                            <IconX size={16} />
                        </button>
                    )}
                    <button type="submit" className="btn btn-sm btn-primary rounded-xl px-4">
                        Buscar
                    </button>
                </form>

                <div className="flex items-center gap-2 bg-white border border-base-200 rounded-2xl p-2 shadow-sm">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50 px-2">Orden</span>
                    <select
                        value={sortBy}
                        onChange={(e) => updateSort(e.target.value)}
                        className="select select-bordered select-sm rounded-xl"
                    >
                        <option value="date">Fecha</option>
                        <option value="subject">Asunto</option>
                        <option value="status">Estado</option>
                        <option value="code">Código</option>
                    </select>
                    <select
                        value={sortDir}
                        onChange={(e) => updateSort(sortBy, e.target.value)}
                        className="select select-bordered select-sm rounded-xl"
                    >
                        <option value="desc">Descendente</option>
                        <option value="asc">Ascendente</option>
                    </select>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === 'list' ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white shadow-xl shadow-base-200/50 rounded-[32px] overflow-hidden border border-base-200"
                    >
                        <div className="overflow-x-auto">
                            <table className="table table-lg w-full">
                                <thead>
                                    <tr className="bg-base-50/50 border-b border-base-100">
                                        <th className="text-[10px] font-black uppercase opacity-40">Código</th>
                                        <th className="text-[10px] font-black uppercase opacity-40">Asunto</th>
                                        <th className="text-[10px] font-black uppercase opacity-40">Fecha y Hora</th>
                                        <th className="text-[10px] font-black uppercase opacity-40">Modalidad</th>
                                        <th className="text-[10px] font-black uppercase opacity-40">Estado</th>
                                        <th className="text-right text-[10px] font-black uppercase opacity-40">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-base-50">
                                    {(Array.isArray(meetings) ? meetings : meetings.data).length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-20">
                                                <div className="flex flex-col items-center opacity-20">
                                                    <IconCalendar size={48} strokeWidth={1} />
                                                    <p className="font-black text-xs uppercase mt-4">No se encontraron reuniones</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        (Array.isArray(meetings) ? meetings : meetings.data).map((meeting) => (
                                            <tr key={meeting.id} className={`group hover:bg-base-50/50 transition-colors ${meeting.status === 'cancelada' ? 'opacity-50' : ''}`}>
                                                <td className="font-black text-primary/40 text-xs tracking-tighter">{meeting.code}</td>
                                                <td>
                                                    <div className="font-black text-sm text-base-content group-hover:text-primary transition-colors">{meeting.subject}</div>
                                                    <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{meeting.department?.name}</div>
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-2 rounded-xl bg-base-100 text-base-content/60 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                            <IconCalendar size={16} />
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-black">{dayjs(meeting.date).format('DD MMM, YYYY')}</div>
                                                            <div className="text-[10px] font-bold opacity-40">{meeting.start_time.substring(0, 5)} - {meeting.end_time.substring(0, 5)}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`p-2 rounded-xl bg-${meeting.mode === 'virtual' ? 'info' : 'error'}/10 text-${meeting.mode === 'virtual' ? 'info' : 'error'}`}>
                                                            {meeting.mode === 'virtual' ? <IconVideo size={16} /> : <IconMapPin size={16} />}
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest italic opacity-60">{meeting.mode}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className={`badge badge-sm font-black text-[9px] uppercase tracking-tighter h-6 px-3 border-none shadow-sm ${meeting.status === 'programada' ? 'bg-primary/10 text-primary' :
                                                            meeting.status === 'realizada' ? 'bg-success/10 text-success' :
                                                                meeting.status === 'cancelada' ? 'bg-error/10 text-error line-through' :
                                                                    'bg-base-200 text-base-content/40'
                                                        }`}>
                                                        {meeting.status}
                                                    </div>
                                                </td>
                                                <td className="text-right">
                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Link href={route('meetings.show', meeting.id)} className="btn btn-ghost btn-sm btn-circle hover:bg-primary/10 hover:text-primary transition-all">
                                                            <IconEye size={18} />
                                                        </Link>
                                                        {meeting.status !== 'cerrada' && (
                                                            <Link href={route('meetings.edit', meeting.id)} className="btn btn-ghost btn-sm btn-circle hover:bg-info/10 hover:text-info transition-all">
                                                                <IconEdit size={18} />
                                                            </Link>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination - Only for list mode */}
                        {!Array.isArray(meetings) && meetings.links && meetings.links.length > 3 && (
                            <div className="p-6 border-t border-base-50 bg-base-50/30 flex justify-center">
                                <div className="join bg-white shadow-sm border border-base-200 p-1 rounded-2xl">
                                    {meetings.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`join-item btn btn-sm border-none rounded-xl font-black text-[10px] ${link.active ? 'btn-primary' : 'btn-ghost opacity-40'} ${!link.url ? 'btn-disabled opacity-10 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="calendar"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-white shadow-xl shadow-base-200/50 rounded-[32px] overflow-hidden border border-base-200 flex flex-col"
                    >
                        {/* Calendar Header */}
                        <div className="p-6 border-b border-base-50 flex items-center justify-between bg-base-50/30">
                            <div className="flex items-center gap-4">
                                <h3 className="font-black text-lg uppercase tracking-tight text-primary">
                                    {currentDate.format('MMMM')} <span className="opacity-30">{currentDate.format('YYYY')}</span>
                                </h3>
                                <div className="flex gap-1">
                                    <button onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))} className="btn btn-ghost btn-xs btn-square rounded-lg border border-base-200">
                                        <IconChevronLeft size={16} />
                                    </button>
                                    <button onClick={() => setCurrentDate(dayjs())} className="btn btn-ghost btn-xs px-2 rounded-lg border border-base-200 font-black text-[9px] uppercase">HOY</button>
                                    <button onClick={() => setCurrentDate(currentDate.add(1, 'month'))} className="btn btn-ghost btn-xs btn-square rounded-lg border border-base-200">
                                        <IconChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-30">
                                    <div className="w-2 h-2 rounded-full bg-primary" /> Programada
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-30">
                                    <div className="w-2 h-2 rounded-full bg-success" /> Realizada
                                </div>
                                {showCancelled && (
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-30">
                                        <div className="w-2 h-2 rounded-full bg-error" /> Cancelada
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 border-b border-base-50 bg-base-50/10">
                            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
                                <div key={day} className="py-3 text-center text-[10px] font-black uppercase opacity-40 tracking-widest">{day}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 flex-1 min-h-[600px]">
                            {calendarDays.map((date, idx) => {
                                const isCurrentMonth = date.month() === currentDate.month();
                                const isToday = date.isSame(dayjs(), 'day');
                                const dayMeetings = getMeetingsForDay(date);

                                return (
                                    <div
                                        key={idx}
                                        className={`min-h-[120px] p-2 border-r border-b border-base-50 transition-all hover:bg-base-50/50 ${!isCurrentMonth ? 'bg-base-100/30' : ''}`}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className={`w-7 h-7 flex items-center justify-center rounded-xl text-xs font-black ${isToday ? 'bg-primary text-white shadow-lg shadow-primary/20' :
                                                    isCurrentMonth ? 'text-base-content' : 'text-base-content/20'
                                                }`}>
                                                {date.date()}
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            {dayMeetings.map(m => (
                                                <Link
                                                    key={m.id}
                                                    href={route('meetings.show', m.id)}
                                                    className={`block p-1.5 rounded-lg border border-transparent hover:border-white hover:shadow-md transition-all group overflow-hidden ${m.status === 'programada' ? 'bg-primary/10 hover:bg-primary shadow-sm active:scale-95' :
                                                            m.status === 'realizada' ? 'bg-success/10 hover:bg-success shadow-sm active:scale-95' :
                                                                m.status === 'cancelada' ? 'bg-error/10 hover:bg-error opacity-60 line-through' :
                                                                    'bg-base-200/50 hover:bg-base-400'
                                                        }`}
                                                >
                                                    <div className={`text-[9px] font-black truncate group-hover:text-white ${m.status === 'programada' ? 'text-primary' :
                                                            m.status === 'realizada' ? 'text-success' :
                                                                m.status === 'cancelada' ? 'text-error' :
                                                                    'text-base-content/40'
                                                        }`}>
                                                        {m.start_time.substring(0, 5)} {m.subject}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
