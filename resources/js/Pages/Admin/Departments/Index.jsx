import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { IconPlus, IconTrash, IconEdit, IconCheck, IconX, IconBuilding } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Index({ departments }) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        name: '',
        description: ''
    });

    const submit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.departments.update', editingId), {
                onSuccess: () => {
                    setEditingId(null);
                    reset();
                }
            });
        } else {
            post(route('admin.departments.store'), {
                onSuccess: () => {
                    setIsAdding(false);
                    reset();
                }
            });
        }
    };

    const edit = (dept) => {
        setEditingId(dept.id);
        setData({
            name: dept.name,
            description: dept.description || ''
        });
        setIsAdding(false);
    };

    const cancel = () => {
        setEditingId(null);
        setIsAdding(false);
        reset();
    };

    return (
        <AuthenticatedLayout header="Estructura > Departamentos">
            <Head title="Departamentos" />

            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter">Departamentos</h1>
                        <p className="text-sm opacity-50 uppercase font-black tracking-widest mt-1">Configuración Organizacional</p>
                    </div>
                    <button
                        onClick={() => { setIsAdding(true); setEditingId(null); reset(); }}
                        className="btn btn-primary rounded-2xl shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        <IconPlus size={20} /> Nuevo Departamento
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario */}
                    <AnimatePresence>
                        {(isAdding || editingId) && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="lg:col-span-1"
                            >
                                <div className="bg-white p-8 rounded-[2rem] border border-base-200 shadow-xl sticky top-24">
                                    <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                            <IconBuilding size={20} />
                                        </div>
                                        {editingId ? 'Editar Departamento' : 'Añadir Departamento'}
                                    </h2>

                                    <form onSubmit={submit} className="space-y-6">
                                        <div className="form-control">
                                            <label className="label"><span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50">Nombre del Departamento</span></label>
                                            <input
                                                type="text"
                                                placeholder="Ej: Gerencia Técnica"
                                                className="input input-bordered rounded-2xl bg-base-100 border-base-300 font-bold"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                required
                                            />
                                            {errors.name && <span className="text-error text-[10px] font-black uppercase mt-1 px-2">{errors.name}</span>}
                                        </div>

                                        <div className="form-control">
                                            <label className="label"><span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50">Descripción (Opcional)</span></label>
                                            <textarea
                                                className="textarea textarea-bordered rounded-2xl bg-base-100 border-base-300 font-bold h-24"
                                                placeholder="Breve detalle del área..."
                                                value={data.description}
                                                onChange={e => setData('description', e.target.value)}
                                            ></textarea>
                                        </div>

                                        <div className="flex gap-2">
                                            <button type="submit" disabled={processing} className="btn btn-primary flex-1 rounded-2xl shadow-lg shadow-primary/20">
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
                        {departments.map(dept => (
                            <motion.div
                                layout
                                key={dept.id}
                                className="bg-white p-6 rounded-[2rem] border border-base-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-[1.25rem] bg-base-200 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                                        <IconBuilding size={24} />
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => edit(dept)} className="btn btn-circle btn-xs btn-ghost text-primary"><IconEdit size={14} /></button>
                                        <button onClick={() => destroy(route('admin.departments.destroy', dept.id))} className="btn btn-circle btn-xs btn-ghost text-error"><IconTrash size={14} /></button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-black tracking-tighter">{dept.name}</h3>
                                <p className="text-sm opacity-50 font-medium line-clamp-2 mt-2">{dept.description || 'Sin descripción'}</p>
                            </motion.div>
                        ))}

                        {departments.length === 0 && (
                            <div className="col-span-full p-20 bg-white rounded-[3rem] border-2 border-dashed border-base-300 flex flex-col items-center justify-center text-center opacity-40">
                                <IconBuilding size={64} strokeWidth={1} className="mb-4" />
                                <p className="font-black text-xl tracking-tighter uppercase">No hay departamentos registrados</p>
                                <p className="text-sm">Comience añadiendo el primer departamento de su organización.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
