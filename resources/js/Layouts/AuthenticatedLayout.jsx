import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Calendar,
    CheckCircle2,
    Users,
    Settings,
    Bell,
    Menu,
    X,
    ChevronRight,
    Search,
    User,
    LogOut,
    Building2,
    AlertCircle,
    Briefcase,
    ShieldCheck,
    BookOpen
} from 'lucide-react';

const NavItem = ({ href, icon: Icon, children, active, badge }) => (
    <Link
        href={href}
        className={`group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 ${active
            ? 'bg-primary text-primary-content shadow-lg shadow-primary/20 scale-[1.02]'
            : 'hover:bg-primary/5 text-base-content/60 hover:text-primary'
            }`}
    >
        <div className="flex items-center gap-3">
            <Icon size={20} strokeWidth={active ? 2.5 : 1.5} className={active ? 'animate-pulse-slow' : 'group-hover:scale-110 transition-transform'} />
            <span className={`text-sm font-black tracking-tight ${active ? 'opacity-100' : 'opacity-80'}`}>{children}</span>
        </div>
        {badge && (
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${active ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                {badge}
            </span>
        )}
    </Link>
);

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (val) => {
        setSearchQuery(val);
        if (val.length < 2) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const response = await fetch(`/api/search?q=${val}`);
            const data = await response.json();
            setSearchResults(data.results);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSearching(false);
        }
    };



    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-outfit selection:bg-primary/10 selection:text-primary">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-white border-r border-base-200 p-6 z-20">
                <div className="flex flex-col items-center justify-center mb-16 group cursor-pointer">
                    <img
                        src="/img/logo-korum.png"
                        alt="Korum Logo"
                        className="h-[120px] w-auto object-contain"
                    />
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
                    <p className="px-4 text-[10px] font-black uppercase opacity-30 tracking-[0.2em] mb-4">Principal</p>
                    <NavItem href={route('dashboard')} icon={LayoutDashboard} active={route().current('dashboard')}>Dashboard</NavItem>
                    <NavItem href={route('meetings.index')} icon={Calendar} active={route().current('meetings.*')} badge="HOY">Reuniones</NavItem>
                    <NavItem href={route('agreements.mypending')} icon={CheckCircle2} active={route().current('agreements.mypending')}>Mis Pendientes</NavItem>
                    <NavItem href={route('agreements.index')} icon={Briefcase} active={route().current('agreements.index')}>Historial</NavItem>

                    {auth.roles.includes('Admin') && (
                        <div className="pt-8 pb-4">
                            <p className="px-4 text-[10px] font-black uppercase opacity-30 tracking-[0.2em] mb-4">Configuración</p>
                            <NavItem href={route('admin.departments.index')} icon={Building2} active={route().current('admin.departments.*')}>Departamentos</NavItem>
                            <NavItem href={route('admin.roles.index')} icon={ShieldCheck} active={route().current('admin.roles.*')}>Roles y Permisos</NavItem>
                            <NavItem href={route('admin.users.index')} icon={Users} active={route().current('admin.users.*')}>Usuarios</NavItem>
                            <NavItem href={route('admin.meeting-types.index')} icon={Settings} active={route().current('admin.meeting-types.*')}>Tipos Reunión</NavItem>
                        </div>
                    )}
                </nav>

                <div className="mt-auto pt-6 border-t border-base-100">
                    <Link
                        href={route('profile.edit')}
                        className="p-4 rounded-3xl bg-secondary/5 border border-secondary/10 group cursor-pointer hover:bg-secondary/10 transition-all flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-black tracking-tight">Mi Perfil</p>
                            <p className="text-[10px] font-bold opacity-40 uppercase">Cuenta</p>
                        </div>
                    </Link>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-80 bg-white z-50 p-8 shadow-2xl lg:hidden flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex justify-center w-full">
                                    <img
                                        src="/img/logo-korum.png"
                                        alt="Korum Logo"
                                        className="h-[100px] w-auto object-contain"
                                    />
                                </div>
                                <button onClick={() => setIsSidebarOpen(false)} className="btn btn-ghost btn-circle">
                                    <X size={24} />
                                </button>
                            </div>

                            <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                                <p className="px-4 text-[10px] font-black uppercase opacity-30 tracking-[0.2em] mb-2 mt-4 text-left">Principal</p>
                                <Link href={route('dashboard')} onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all text-base-content/60 hover:text-primary font-black text-sm">
                                    <LayoutDashboard size={22} /> <span>Dashboard</span>
                                </Link>
                                <Link href={route('meetings.index')} onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all text-base-content/60 hover:text-primary font-black text-sm">
                                    <Calendar size={22} /> <span>Reuniones</span>
                                </Link>
                                <Link href={route('agreements.mypending')} onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all text-base-content/60 hover:text-primary font-black text-sm">
                                    <CheckCircle2 size={22} /> <span>Mis Pendientes</span>
                                </Link>
                                <Link href={route('agreements.index')} onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all text-base-content/60 hover:text-primary font-black text-sm">
                                    <Briefcase size={22} /> <span>Historial</span>
                                </Link>

                                {auth.roles.includes('Admin') && (
                                    <>
                                        <p className="px-4 text-[10px] font-black uppercase opacity-30 tracking-[0.2em] mb-2 mt-6 text-left">Configuración</p>
                                        <Link href={route('admin.departments.index')} onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all text-base-content/60 hover:text-primary font-black text-sm">
                                            <Building2 size={22} /> <span>Departamentos</span>
                                        </Link>
                                        <Link href={route('admin.roles.index')} onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all text-base-content/60 hover:text-primary font-black text-sm">
                                            <ShieldCheck size={22} /> <span>Roles y Permisos</span>
                                        </Link>
                                        <Link href={route('admin.users.index')} onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all text-base-content/60 hover:text-primary font-black text-sm">
                                            <Users size={22} /> <span>Usuarios</span>
                                        </Link>
                                        <Link href={route('admin.meeting-types.index')} onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all text-base-content/60 hover:text-primary font-black text-sm">
                                            <Settings size={22} /> <span>Tipos Reunión</span>
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Spectacular Glass Header */}
                <header className="h-20 glass-header flex items-center justify-between px-6 lg:px-10 shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden btn btn-ghost btn-circle group">
                            <Menu size={24} className="group-hover:text-primary transition-colors" />
                        </button>
                        {header && (
                            <h2 className="text-sm font-black tracking-[0.2em] uppercase opacity-40 hidden sm:block">
                                {header}
                            </h2>
                        )}
                    </div>

                    <div className="flex items-center gap-4 md:gap-8">
                        <a
                            href={route('manual.user')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-base-200 bg-white hover:bg-primary/5 hover:border-primary/30 transition-all"
                        >
                            <BookOpen size={16} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-base-content/70">Manual de Usuario</span>
                        </a>

                        {/* Search Quick Access Spectacular */}
                        <div className="hidden md:block relative group">
                            <div className="flex items-center gap-3 px-5 py-2.5 bg-base-200/50 rounded-2xl border border-transparent focus-within:border-primary/30 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-primary/5 transition-all w-80">
                                <Search size={18} className={`transition-colors ${searchQuery ? 'text-primary' : 'opacity-30'}`} />
                                <input
                                    type="text"
                                    placeholder="BUSCAR EN KORUM..."
                                    className="bg-transparent border-none focus:ring-0 p-0 text-[10px] font-black uppercase tracking-widest w-full placeholder:text-base-content/20"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                {isSearching && <span className="loading loading-spinner loading-xs text-primary"></span>}
                            </div>

                            <AnimatePresence>
                                {searchResults.length > 0 && searchQuery.length >= 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 right-0 mt-3 p-2 bg-white border border-base-200 shadow-2xl rounded-3xl z-[110] overflow-hidden"
                                    >
                                        <div className="flex flex-col gap-1">
                                            {searchResults.map((res, idx) => (
                                                <Link
                                                    key={idx}
                                                    href={res.url}
                                                    onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                                                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-primary/5 transition-all group"
                                                >
                                                    <div className={`p-2 rounded-xl bg-${res.type === 'meeting' ? 'primary' : 'secondary'}/10 text-${res.type === 'meeting' ? 'primary' : 'secondary'}`}>
                                                        {res.type === 'meeting' ? <Calendar size={14} /> : <CheckCircle2 size={14} />}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-black truncate group-hover:text-primary transition-colors">{res.title}</p>
                                                        <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{res.subtitle} • {res.status}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Notifications spectacular dropdown */}
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle relative hover:bg-primary/5 transition-colors group">
                                <Bell size={22} className="text-base-content/60 group-hover:text-primary transition-colors" />
                                {auth.unread_count > 0 && (
                                    <span className="absolute top-2.5 right-2.5 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary border-2 border-white"></span>
                                    </span>
                                )}
                            </label>
                            <div tabIndex={0} className="dropdown-content z-[100] mt-4 w-80 p-0 shadow-2xl rounded-3xl bg-base-100 border border-base-200 overflow-hidden backdrop-blur-xl bg-opacity-95">
                                <div className="p-5 border-b border-base-200 flex items-center justify-between">
                                    <h3 className="font-black text-xs uppercase tracking-[0.2em]">Notificaciones</h3>
                                    {auth.unread_count > 0 && (
                                        <Link
                                            href={route('notifications.mark-read')}
                                            method="post"
                                            as="button"
                                            className="text-[10px] font-black text-primary uppercase hover:underline"
                                        >
                                            Limpiar
                                        </Link>
                                    )}
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {!auth.notifications || auth.notifications.length === 0 ? (
                                        <div className="p-10 text-center opacity-20 italic">
                                            <Bell size={32} className="mx-auto mb-2" />
                                            <p className="text-[10px] font-black uppercase">Todo en orden</p>
                                        </div>
                                    ) : (
                                        auth.notifications.map((notif) => (
                                            <div key={notif.id} className="p-4 border-b border-base-100 hover:bg-primary/5 transition-colors cursor-pointer group">
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-2.5 rounded-xl bg-${notif.data.type === 'due_soon' ? 'error' : 'primary'}/10 text-${notif.data.type === 'due_soon' ? 'error' : 'primary'}`}>
                                                        <AlertCircle size={14} />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs font-bold leading-tight mb-1 group-hover:text-primary transition-colors">{notif.data.message}</p>
                                                        <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest truncate">{notif.data.subject}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="p-4 bg-base-200/50 text-center">
                                    <p className="text-[10px] font-black uppercase opacity-30">Gestión de Gobernanza Korum</p>
                                </div>
                            </div>
                        </div>

                        {/* User Profile */}
                        <div className="flex items-center gap-3 pl-4 border-l border-base-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-black tracking-tight">{auth.user.name}</p>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest opacity-40">Administrador</p>
                            </div>
                            <div className="avatar dropdown dropdown-end">
                                <div tabIndex={0} className="w-10 h-10 rounded-2xl ring-2 ring-primary/10 hover:ring-primary/40 transition-all cursor-pointer overflow-hidden shadow-inner">
                                    <div className="bg-primary text-primary-content font-black text-xs flex items-center justify-center w-full h-full">
                                        {auth.user.name.charAt(0)}
                                    </div>
                                </div>
                                <ul tabIndex={0} className="dropdown-content z-[100] menu p-2 shadow-2xl bg-base-100 rounded-2xl w-52 mt-4 border border-base-200 backdrop-blur-xl">
                                    <li><Link href={route('profile.edit')} className="flex items-center gap-3 font-bold text-sm rounded-xl p-3"><User size={16} /> Perfil</Link></li>
                                    <li><Link href={route('logout')} method="post" as="button" className="flex items-center gap-3 font-bold text-sm text-error rounded-xl p-3"><LogOut size={16} /> Salir</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Smooth Page Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth bg-[#F8FAFC]">
                    {(flash?.success || flash?.error) && (
                        <div className="mb-6 space-y-3">
                            {flash?.success && (
                                <div className="alert alert-success shadow-md rounded-2xl">
                                    <span className="text-sm font-bold">{flash.success}</span>
                                </div>
                            )}
                            {flash?.error && (
                                <div className="alert alert-error shadow-md rounded-2xl">
                                    <span className="text-sm font-bold">{flash.error}</span>
                                </div>
                            )}
                        </div>
                    )}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={header}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
