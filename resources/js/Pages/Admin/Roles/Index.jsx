import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { IconPlus, IconTrash, IconEdit, IconCheck, IconX, IconShield, IconKey, IconLock } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Index({ roles, permissions }) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingRole, setEditingRole] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        name: '',
        permissions: []
    });

    const submit = (e) => {
        e.preventDefault();
        if (editingRole) {
            put(route('admin.roles.update', editingRole.id), {
                onSuccess: () => {
                    setEditingRole(null);
                    reset();
                }
            });
        } else {
            post(route('admin.roles.store'), {
                onSuccess: () => {
                    setIsAdding(false);
                    reset();
                }
            });
        }
    };

    const edit = (role) => {
        setEditingRole(role);
        setData({
            name: role.name,
            permissions: role.permissions.map(p => p.name)
        });
        setIsAdding(false);
    };

    const cancel = () => {
        setEditingRole(null);
        setIsAdding(false);
        reset();
    };

    return (
        <AuthenticatedLayout header="Estructura > Roles">
            <Head title="Gestión de Roles" />

            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter">Roles y Seguridad</h1>
                        <p className="text-sm opacity-50 uppercase font-black tracking-widest mt-1">Control de Acceso Basado en Roles (RBAC)</p>
                    </div>
                    <button
                        onClick={() => { setIsAdding(true); setEditingRole(null); reset(); }}
                        className="btn btn-primary rounded-2xl shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        <IconPlus size={20} /> Nuevo Rol
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Formulario */}
                    <AnimatePresence>
                        {(isAdding || editingRole) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="lg:col-span-1"
                            >
                                <div className="bg-white p-8 rounded-[2rem] border border-base-200 shadow-xl sticky top-24">
                                    <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                                            <IconShield size={20} />
                                        </div>
                                        {editingRole ? 'Editar Rol' : 'Nuevo Rol'}
                                    </h2>

                                    <form onSubmit={submit} className="space-y-6">
                                        <div className="form-control">
                                            <label className="label"><span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50">Nombre del Rol</span></label>
                                            <div className="relative">
                                                <IconLock className="absolute left-4 top-3.5 opacity-30" size={18} />
                                                <input
                                                    type="text"
                                                    className="input input-bordered w-full pl-11 rounded-2xl bg-base-100 border-base-300 font-bold"
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    placeholder="Ej: Auditor"
                                                    required
                                                />
                                            </div>
                                            {errors.name && <span className="text-error text-[10px] font-black uppercase mt-1 px-2">{errors.name}</span>}
                                        </div>

                                        <div className="form-control">
                                            <label className="label"><span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50">Permisos Asignados</span></label>
                                            <div className="grid grid-cols-1 gap-2 p-3 bg-base-100 rounded-2xl border border-base-300 max-h-64 overflow-y-auto">
                                                {permissions.map(perm => (
                                                    <label key={perm.id} className="label cursor-pointer justify-start gap-2 hover:bg-base-200 p-1 rounded-lg transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            className="checkbox checkbox-secondary checkbox-xs"
                                                            checked={data.permissions.includes(perm.name)}
                                                            onChange={(e) => {
                                                                const newPerms = [...data.permissions];
                                                                if (e.target.checked) {
                                                                    newPerms.push(perm.name);
                                                                } else {
                                                                    const index = newPerms.indexOf(perm.name);
                                                                    if (index > -1) newPerms.splice(index, 1);
                                                                }
                                                                setData('permissions', newPerms);
                                                            }}
                                                        />
                                                        <span className="label-text text-[10px] font-bold">{perm.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            {errors.permissions && <span className="text-error text-[10px] font-black uppercase mt-1 px-2">{errors.permissions}</span>}
                                        </div>

                                        <div className="flex gap-2 pt-4">
                                            <button type="submit" disabled={processing} className="btn btn-secondary text-white flex-1 rounded-2xl shadow-lg shadow-secondary/20">
                                                <IconCheck size={20} /> {editingRole ? 'Actualizar' : 'Crear Rol'}
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
                    <div className={(isAdding || editingRole) ? "lg:col-span-3 space-y-4" : "lg:col-span-4"}>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {roles.map(role => (
                                <motion.div
                                    layout
                                    key={role.id}
                                    className="bg-white p-6 rounded-[2.5rem] border border-base-200 shadow-sm hover:shadow-2xl transition-all group flex flex-col gap-4"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center font-black text-xl">
                                                <IconShield size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black tracking-tighter">{role.name}</h3>
                                                <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{role.permissions?.length || 0} Permisos</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => edit(role)} className="btn btn-circle btn-xs btn-ghost text-secondary"><IconEdit size={14} /></button>
                                            <button
                                                onClick={() => {
                                                    if (confirm('¿Eliminar este rol?')) {
                                                        destroy(route('admin.roles.destroy', role.id));
                                                    }
                                                }}
                                                className="btn btn-circle btn-xs btn-ghost text-error"
                                                disabled={role.name === 'Admin'}
                                            >
                                                <IconTrash size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {role.permissions?.slice(0, 6).map(perm => (
                                            <span key={perm.id} className="px-2 py-0.5 bg-base-100 rounded-md border border-base-200 text-[9px] font-bold uppercase opacity-60">
                                                {perm.name}
                                            </span>
                                        ))}
                                        {role.permissions?.length > 6 && (
                                            <span className="px-2 py-0.5 bg-base-100 rounded-md border border-base-200 text-[9px] font-bold uppercase opacity-30">
                                                +{role.permissions.length - 6} más
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {roles.length === 0 && (
                            <div className="p-20 bg-white rounded-[3rem] border-2 border-dashed border-base-300 flex flex-col items-center justify-center text-center opacity-40">
                                <IconKey size={64} strokeWidth={1} className="mb-4" />
                                <p className="font-black text-xl tracking-tighter uppercase">No hay roles definidos</p>
                                <p className="text-sm">Configure los niveles de acceso para su equipo.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
