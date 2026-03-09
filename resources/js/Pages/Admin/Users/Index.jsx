import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { IconPlus, IconTrash, IconEdit, IconCheck, IconX, IconUsers, IconUser, IconMail, IconLock, IconHierarchy } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Index({ users, departments, roles }) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        name: '',
        email: '',
        password: '',
        department_id: '',
        roles: []
    });

    const submit = (e) => {
        e.preventDefault();
        if (editingUser) {
            put(route('admin.users.update', editingUser.id), {
                onSuccess: () => {
                    setEditingUser(null);
                    reset();
                }
            });
        } else {
            post(route('admin.users.store'), {
                onSuccess: () => {
                    setIsAdding(false);
                    reset();
                }
            });
        }
    };

    const edit = (user) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            department_id: user.department_id || '',
            roles: user.roles?.map(r => r.name) || []
        });
        setIsAdding(false);
    };

    const cancel = () => {
        setEditingUser(null);
        setIsAdding(false);
        reset();
    };

    return (
        <AuthenticatedLayout header="Estructura > Usuarios">
            <Head title="Gestión de Usuarios" />

            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter">Usuarios</h1>
                        <p className="text-sm opacity-50 uppercase font-black tracking-widest mt-1">Control de Acceso y Colaboradores</p>
                    </div>
                    <button
                        onClick={() => { setIsAdding(true); setEditingUser(null); reset(); }}
                        className="btn btn-primary rounded-2xl shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        <IconPlus size={20} /> Nuevo Colaborador
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Formulario */}
                    <AnimatePresence>
                        {(isAdding || editingUser) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="lg:col-span-1"
                            >
                                <div className="bg-white p-8 rounded-[2rem] border border-base-200 shadow-xl sticky top-24">
                                    <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                            <IconUser size={20} />
                                        </div>
                                        {editingUser ? 'Editar Perfil' : 'Nuevo Registro'}
                                    </h2>

                                    <form onSubmit={submit} className="space-y-4">
                                        <div className="form-control">
                                            <label className="label"><span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50">Nombre Completo</span></label>
                                            <div className="relative">
                                                <IconUser className="absolute left-4 top-3.5 opacity-30" size={18} />
                                                <input
                                                    type="text"
                                                    className="input input-bordered w-full pl-11 rounded-2xl bg-base-100 border-base-300 font-bold"
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            {errors.name && <span className="text-error text-[10px] font-black uppercase mt-1 px-2">{errors.name}</span>}
                                        </div>

                                        <div className="form-control">
                                            <label className="label"><span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50">Correo Electrónico</span></label>
                                            <div className="relative">
                                                <IconMail className="absolute left-4 top-3.5 opacity-30" size={18} />
                                                <input
                                                    type="email"
                                                    className="input input-bordered w-full pl-11 rounded-2xl bg-base-100 border-base-300 font-bold"
                                                    value={data.email}
                                                    onChange={e => setData('email', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            {errors.email && <span className="text-error text-[10px] font-black uppercase mt-1 px-2">{errors.email}</span>}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50">
                                                    Contraseña {editingUser && '(Dejar en blanco para no cambiar)'}
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <IconLock className="absolute left-4 top-3.5 opacity-30" size={18} />
                                                <input
                                                    type="password"
                                                    className="input input-bordered w-full pl-11 rounded-2xl bg-base-100 border-base-300 font-bold"
                                                    value={data.password}
                                                    onChange={e => setData('password', e.target.value)}
                                                    required={!editingUser}
                                                />
                                            </div>
                                            {errors.password && <span className="text-error text-[10px] font-black uppercase mt-1 px-2">{errors.password}</span>}
                                        </div>

                                        <div className="form-control">
                                            <label className="label"><span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50">Roles</span></label>
                                            <div className="grid grid-cols-2 gap-2 p-3 bg-base-100 rounded-2xl border border-base-300 max-h-40 overflow-y-auto">
                                                {roles.map(role => (
                                                    <label key={role.id} className="label cursor-pointer justify-start gap-2 hover:bg-base-200 p-1 rounded-lg transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            className="checkbox checkbox-primary checkbox-xs"
                                                            checked={data.roles.includes(role.name)}
                                                            onChange={(e) => {
                                                                const newRoles = [...data.roles];
                                                                if (e.target.checked) {
                                                                    newRoles.push(role.name);
                                                                } else {
                                                                    const index = newRoles.indexOf(role.name);
                                                                    if (index > -1) newRoles.splice(index, 1);
                                                                }
                                                                setData('roles', newRoles);
                                                            }}
                                                        />
                                                        <span className="label-text text-[10px] font-bold truncate">{role.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            {errors.roles && <span className="text-error text-[10px] font-black uppercase mt-1 px-2">{errors.roles}</span>}
                                        </div>

                                        <div className="form-control">
                                            <label className="label"><span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50">Departamento</span></label>
                                            <div className="relative">
                                                <IconHierarchy className="absolute left-4 top-3.5 opacity-30" size={18} />
                                                <select
                                                    className="select select-bordered w-full pl-11 rounded-2xl bg-base-100 border-base-300 font-bold"
                                                    value={data.department_id}
                                                    onChange={e => setData('department_id', e.target.value)}
                                                >
                                                    <option value="">Seleccionar Departamento</option>
                                                    {departments.map(dept => (
                                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {errors.department_id && <span className="text-error text-[10px] font-black uppercase mt-1 px-2">{errors.department_id}</span>}
                                        </div>

                                        <div className="flex gap-2 pt-4">
                                            <button type="submit" disabled={processing} className="btn btn-primary flex-1 rounded-2xl shadow-lg shadow-primary/20">
                                                <IconCheck size={20} /> {editingUser ? 'Actualizar' : 'Guardar'}
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
                    <div className={(isAdding || editingUser) ? "lg:col-span-3 space-y-4" : "lg:col-span-4"}>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {users.map(user => (
                                <motion.div
                                    layout
                                    key={user.id}
                                    className="bg-white p-6 rounded-[2.5rem] border border-base-200 shadow-sm hover:shadow-2xl transition-all group flex items-center gap-5"
                                >
                                    <div className="avatar">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 text-primary flex items-center justify-center font-black text-xl ring-4 ring-primary/5">
                                            {user.name.charAt(0)}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-black tracking-tighter truncate">{user.name}</h3>
                                                <p className="text-xs opacity-40 font-bold truncate">{user.email}</p>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => edit(user)} className="btn btn-circle btn-xs btn-ghost text-primary"><IconEdit size={14} /></button>
                                                <button onClick={() => destroy(route('admin.users.destroy', user.id))} className="btn btn-circle btn-xs btn-ghost text-error"><IconTrash size={14} /></button>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-base-100 rounded-full border border-base-200">
                                                <IconHierarchy size={12} className="opacity-40" />
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                                    {user.department?.name || 'Invitado Global'}
                                                </span>
                                            </div>
                                            {user.roles?.map(role => (
                                                <div key={role.id} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
                                                    <div className="w-1 h-1 rounded-full bg-primary animate-pulse"></div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                                        {role.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {users.length === 0 && (
                            <div className="p-20 bg-white rounded-[3rem] border-2 border-dashed border-base-300 flex flex-col items-center justify-center text-center opacity-40">
                                <IconUsers size={64} strokeWidth={1} className="mb-4" />
                                <p className="font-black text-xl tracking-tighter uppercase">No hay usuarios registrados</p>
                                <p className="text-sm">Inicie el despliegue añadiendo a su equipo.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
