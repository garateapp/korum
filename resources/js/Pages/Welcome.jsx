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
            <nav className="fixed top-0 left-0 right-0 h-30 glass-header flex items-center justify-between px-6 lg:px-20 z-50">
                <div className="flex items-center gap-2 group cursor-pointer">

                    <img
                        src="/img/logo-korum.png"
                        alt="Korum Logo"
                        className="h-[120px] w-auto object-contain"
                    />

                </div>
                <div className="flex items-center gap-4">
                    {auth.user ? (
                        <Link href={route('dashboard')} className="btn btn-primary rounded-2xl font-black px-6 shadow-xl shadow-primary/20">
                            Ir al Panel
                        </Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="btn btn-ghost font-bold opacity-60 hover:opacity-100">Iniciar Sesión</Link>

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

                    </motion.div>

                    {/* Screenshot Placeholder with Bento Card */}

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


            {/* Footer */}

        </div>
    );
}
