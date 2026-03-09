import { Link, Head } from '@inertiajs/react';
import {
    Calendar,
    ClipboardCheck,
    Target,
    Users,
    ArrowRight,
    CheckCircle,
    Zap,
    Shield,
    BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Welcome({ auth }) {
    return (
        <div className="min-h-screen bg-base-100 font-sans selection:bg-primary/20 overflow-hidden">
            <Head title="Bienvenido a Korum" />

            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 h-20 glass-header flex items-center justify-between px-6 lg:px-20 z-50">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <img src="/img/logo-korum.png" alt="Korum Logo" className="w-10 h-10 object-contain group-hover:rotate-12 transition-transform" />
                    <span className="text-2xl font-black tracking-tight text-primary">Korum</span>
                </div>
                <div className="flex items-center gap-4">
                    {auth.user ? (
                        <Link href={route('dashboard')} className="btn btn-primary rounded-2xl font-black px-6 shadow-xl shadow-primary/20">
                            Ir al Panel
                        </Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="btn btn-ghost font-bold opacity-60 hover:opacity-100">Iniciar Sesión</Link>
                            <Link href={route('register')} className="btn btn-primary rounded-2xl font-black px-8 shadow-xl shadow-primary/20">Empieza Gratis</Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <main className="pt-32 pb-20 relative">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-float"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -z-10"></div>

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="badge badge-primary badge-outline font-black text-[10px] uppercase tracking-widest px-4 py-3 mb-6">Nueva Era en Gestión</span>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-base-content leading-[0.9] mb-8">
                            Acuerdos claros, <br />
                            <span className="text-primary italic">equipos que cumplen.</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl font-medium opacity-50 mb-12 leading-relaxed">
                            Korum transforma tus reuniones en acciones trazables. Planifica, registra y haz seguimiento de cada decisión hasta su éxito final.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href={route('register')} className="btn btn-primary btn-lg rounded-3xl px-12 font-black uppercase tracking-widest shadow-2xl shadow-primary/30 h-16">
                                Crear mi Cuenta <ArrowRight className="ml-2" />
                            </Link>
                            <button className="btn btn-ghost btn-lg rounded-3xl px-8 font-bold opacity-60">Ver Demo en Video</button>
                        </div>
                    </motion.div>

                    {/* Screenshot Placeholder with Bento Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 1 }}
                        className="mt-24 relative max-w-5xl mx-auto"
                    >
                        <div className="aspect-video bg-base-200 rounded-[2.5rem] border-4 border-base-100 shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden flex items-center justify-center group relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
                            <div className="bento-card max-w-md w-full m-8 scale-90 md:scale-100 shadow-2xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-success/10 text-success rounded-2xl"><CheckCircle /></div>
                                    <div className="flex-1"><h3 className="font-black text-left">Acuerdo Realizado</h3><div className="w-full bg-base-300 h-2 rounded-full mt-1 overflow-hidden"><div className="w-[85%] h-full bg-success"></div></div></div>
                                </div>
                                <p className="text-left text-sm font-medium opacity-60">Implementar sistema de seguimiento de minutos en fase beta.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Features Bento Grid */}
            <section className="py-32 bg-base-200/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-20">
                        <h2 className="text-4xl font-black tracking-tight mb-4">Potencia tu organización</h2>
                        <p className="font-medium opacity-40">Herramientas diseñadas para la productividad moderna.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div whileHover={{ y: -10 }} className="bento-card md:col-span-2 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-primary/5 to-transparent">
                            <div className="p-8 bg-primary rounded-3xl text-primary-content shadow-xl shadow-primary/20"><Calendar size={48} /></div>
                            <div>
                                <h3 className="text-2xl font-black mb-3 text-primary">Agenda Dinámica</h3>
                                <p className="font-bold opacity-60 leading-relaxed">Planifica los puntos clave antes de empezar. Un equipo con agenda clara es un equipo enfocado.</p>
                            </div>
                        </motion.div>

                        <motion.div whileHover={{ y: -10 }} className="bento-card bg-secondary/5 border-secondary/20">
                            <div className="mb-6 text-secondary"><Zap size={40} /></div>
                            <h3 className="text-xl font-black mb-2">Actas Instantáneas</h3>
                            <p className="text-sm font-bold opacity-50">Genera minutas al finalizar con un solo clic. Sin papeleo, sin olvidos.</p>
                        </motion.div>

                        <motion.div whileHover={{ y: -10 }} className="bento-card border-accent/20">
                            <div className="mb-6 text-accent"><Target size={40} /></div>
                            <h3 className="text-xl font-black mb-2">Trazabilidad Total</h3>
                            <p className="text-sm font-bold opacity-50">Historial completo de cada cambio en los compromisos adquiridos.</p>
                        </motion.div>

                        <motion.div whileHover={{ y: -10 }} className="bento-card md:col-span-2 bg-gradient-to-tr from-accent/5 to-transparent flex flex-col md:flex-row items-center gap-8">
                            <div className="p-8 bg-accent rounded-3xl text-accent-content shadow-xl shadow-accent/20"><BarChart3 size={48} /></div>
                            <div>
                                <h3 className="text-2xl font-black mb-3 text-accent">Métricas de Valor</h3>
                                <p className="font-bold opacity-60 leading-relaxed">Dashboards interactivos para visualizar el cumplimiento de objetivos por área y persona.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-40 text-center relative">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-5xl font-black tracking-tighter mb-10">¿Listo para transformar <br />tus reuniones?</h2>
                    <Link href={route('register')} className="btn btn-primary btn-lg rounded-3xl px-16 font-black uppercase tracking-widest shadow-2xl shadow-primary/30 h-16">
                        Comenzar ahora
                    </Link>
                    <p className="mt-8 text-xs font-bold opacity-30 uppercase tracking-[0.3em]">No se requiere tarjeta de crédito</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer p-10 bg-base-100 text-base-content border-t border-base-200">
                <aside>
                    <div className="flex items-center gap-2 mb-4">
                        <img src="/img/logo-korum.png" alt="Logo" className="w-8 h-8 object-contain" />
                        <span className="text-xl font-black tracking-tighter text-primary">Korum</span>
                    </div>
                    <p className="font-bold opacity-40">Korum Management S.A.<br />Un producto de excelencia organizacional.</p>
                </aside>
                <nav>
                    <h6 className="footer-title opacity-40">Producto</h6>
                    <a className="link link-hover font-bold">Características</a>
                    <a className="link link-hover font-bold">Precios</a>
                    <a className="link link-hover font-bold">Seguridad</a>
                </nav>
                <nav>
                    <h6 className="footer-title opacity-40">Compañía</h6>
                    <a className="link link-hover font-bold">Acerca de</a>
                    <a className="link link-hover font-bold">Contacto</a>
                    <a className="link link-hover font-bold">Blog</a>
                </nav>
                <nav>
                    <h6 className="footer-title opacity-40">Legal</h6>
                    <a className="link link-hover font-bold">Términos de uso</a>
                    <a className="link link-hover font-bold">Privacidad</a>
                    <a className="link link-hover font-bold">Cookies</a>
                </nav>
            </footer>
        </div>
    );
}
