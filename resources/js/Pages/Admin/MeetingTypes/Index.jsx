import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { IconPlus, IconTrash, IconEdit, IconCheck, IconX, IconSettings } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Index({ meetingTypes }) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        name: '',
        description: ''
    });

    const submit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.meeting-types.update', editingId), {
                onSuccess: () => {
                    setEditingId(null);
                    reset();
                }
            });
        } else {
            post(route('admin.meeting-types.store'), {
                onSuccess: () => {
                    setIsAdding(false);
                    reset();
                }
            });
        }
    };

    const edit = (type) => {
        setEditingId(type.id);
        setData({
            name: type.name,
            description: type.description || ''
        });
        setIsAdding(false);
    };

    const cancel = () => {
        setEditingId(null);
        setIsAdding(false);
        reset();
    };

    return (
        <AuthenticatedLayout header="Configuración > Tipos de Reunión">
            <Head title="Tipos de Reunión" />

            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter">Tipos de Reunión</h1>
                        <p className="text-sm opacity-50 uppercase font-black tracking-widest mt-1">Gestión de Categorías</p>
                    </div>
                    <button
                        onClick={() => { setIsAdding(true); setEditingId(null); reset(); }}
                        className="btn btn-secondary rounded-2xl shadow-lg shadow-secondary/20 flex items-center gap-2"
                    >
                        <IconPlus size={20} /> Nuevo Tipo
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario */}
                    <AnimatePresence>
                        {(isAdding || editingId) && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="lg:col-span-1"
                            >
                                <div className="bg-white p-8 rounded-[2rem] border border-base-200 shadow-xl sticky top-24">
                                    <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                                            <IconSettings size={20} />
                                        </div>
                                        {editingId ? 'Editar Tipo' : 'Añadir Tipo'}
                                    </h2>

                                    <form onSubmit={submit} className="space-y-6">
                                        <div className="form-control">
                                            <label className="label"><span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50">Nombre de la Categoría</span></label>
                                            <input
                                                type="text"
                                                placeholder="Ej: Comité Ejecutivo"
                                                className="input input-bordered rounded-2xl bg-base-100 border-base-300 font-bold"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                required
                                            />
                                            {errors.name && <span className="text-error text-[10px] font-black uppercase mt-1 px-2">{errors.name}</span>}
                                        </div>

                                        <div className="form-control">
                                            <label className="label"><span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50">Descripción</span></label>
                                            <textarea
                                                className="textarea textarea-bordered rounded-2xl bg-base-100 border-base-300 font-bold h-24"
                                                placeholder="Propósito de este tipo de reunión..."
                                                value={data.description}
                                                onChange={e => setData('description', e.target.value)}
                                            ></textarea>
                                        </div>

                                        <div className="flex gap-2">
                                            <button type="submit" disabled={processing} className="btn btn-secondary flex-1 rounded-2xl shadow-lg shadow-secondary/20">
                                                <IconCheck size={20} /> {editingId ? 'Actualizar' : 'Guardar'}
                                            </button>
                                            <button type="button" onClick={cancel} className="btn btn-ghost rounded-2xl">
                                                <IconX size={20} />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Listado */}
                    <div className={(isAdding || editingId) ? "lg:col-span-2 space-y-4" : "lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
                        {meetingTypes.map(type => (
                            <motion.div
                                layout
                                key={type.id}
                                className="bg-white p-6 rounded-[2rem] border border-base-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative"
                            >
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-colors"></div>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="w-12 h-12 rounded-[1.25rem] bg-secondary/5 flex items-center justify-center text-secondary">
                                        <IconSettings size={24} />
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => edit(type)} className="btn btn-circle btn-xs btn-ghost text-secondary"><IconEdit size={14} /></button>
                                        <button onClick={() => destroy(route('admin.meeting-types.destroy', type.id))} className="btn btn-circle btn-xs btn-ghost text-error"><IconTrash size={14} /></button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-black tracking-tighter relative z-10">{type.name}</h3>
                                <p className="text-sm opacity-50 font-medium line-clamp-2 mt-2 relative z-10">{type.description || 'Sin descripción'}</p>
                            </motion.div>
                        ))}

                        {meetingTypes.length === 0 && (
                            <div className="col-span-full p-20 bg-white rounded-[3rem] border-2 border-dashed border-base-300 flex flex-col items-center justify-center text-center opacity-40">
                                <IconSettings size={64} strokeWidth={1} className="mb-4" />
                                <p className="font-black text-xl tracking-tighter uppercase">No hay tipos registrados</p>
                                <p className="text-sm">Categorice sus reuniones para una mejor trazabilidad.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
