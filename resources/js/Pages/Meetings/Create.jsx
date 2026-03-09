import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { IconDeviceFloppy, IconArrowLeft } from '@tabler/icons-react';

export default function Create({ auth, departments, meetingTypes }) {
    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        description: '',
        date: '',
        start_time: '',
        end_time: '',
        mode: 'presencial',
        location_link: '',
        department_id: '',
        meeting_type_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('meetings.store'));
    };

    return (
        <AuthenticatedLayout header="Nueva Reunión">
            <Head title="Nueva Reunión" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Planificar Actividad</h2>
                <Link href={route('meetings.index')} className="btn btn-ghost">
                    <IconArrowLeft size={20} /> Volver
                </Link>
            </div>

            <div className="bg-base-100 shadow-sm sm:rounded-lg p-6 max-w-4xl">
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Asunto */}
                        <div className="form-control w-full md:col-span-2">
                            <label className="label"><span className="label-text font-semibold">Asunto de la reunión *</span></label>
                            <input
                                type="text"
                                placeholder="Ej: Revisión de avance Proyecto X"
                                className={`input input-bordered w-full ${errors.subject ? 'input-error' : ''}`}
                                value={data.subject}
                                onChange={e => setData('subject', e.target.value)}
                            />
                            {errors.subject && <span className="text-error text-sm mt-1">{errors.subject}</span>}
                        </div>

                        {/* Fecha */}
                        <div className="form-control w-full">
                            <label className="label"><span className="label-text font-semibold">Fecha *</span></label>
                            <input
                                type="date"
                                className={`input input-bordered w-full ${errors.date ? 'input-error' : ''}`}
                                value={data.date}
                                onChange={e => setData('date', e.target.value)}
                            />
                            {errors.date && <span className="text-error text-sm mt-1">{errors.date}</span>}
                        </div>

                        {/* Tipo de reunión */}
                        <div className="form-control w-full">
                            <label className="label"><span className="label-text font-semibold">Tipo de reunión</span></label>
                            <select
                                className="select select-bordered w-full"
                                value={data.meeting_type_id}
                                onChange={e => setData('meeting_type_id', e.target.value)}
                            >
                                <option value="" disabled>Seleccione...</option>
                                {meetingTypes?.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                            {errors.meeting_type_id && <span className="text-error text-sm mt-1">{errors.meeting_type_id}</span>}
                        </div>

                        {/* Hora inicio */}
                        <div className="form-control w-full">
                            <label className="label"><span className="label-text font-semibold">Hora Inicio *</span></label>
                            <input
                                type="time"
                                className={`input input-bordered w-full ${errors.start_time ? 'input-error' : ''}`}
                                value={data.start_time}
                                onChange={e => setData('start_time', e.target.value)}
                            />
                            {errors.start_time && <span className="text-error text-sm mt-1">{errors.start_time}</span>}
                        </div>

                        {/* Hora término */}
                        <div className="form-control w-full">
                            <label className="label"><span className="label-text font-semibold">Hora Término Estimada *</span></label>
                            <input
                                type="time"
                                className={`input input-bordered w-full ${errors.end_time ? 'input-error' : ''}`}
                                value={data.end_time}
                                onChange={e => setData('end_time', e.target.value)}
                            />
                            {errors.end_time && <span className="text-error text-sm mt-1">{errors.end_time}</span>}
                        </div>

                        {/* Área organizadora */}
                        <div className="form-control w-full">
                            <label className="label"><span className="label-text font-semibold">Área organizadora *</span></label>
                            <select
                                className={`select select-bordered w-full ${errors.department_id ? 'select-error' : ''}`}
                                value={data.department_id}
                                onChange={e => setData('department_id', e.target.value)}
                            >
                                <option value="" disabled>Seleccione...</option>
                                {departments?.map(depto => (
                                    <option key={depto.id} value={depto.id}>{depto.name}</option>
                                ))}
                            </select>
                            {errors.department_id && <span className="text-error text-sm mt-1">{errors.department_id}</span>}
                        </div>

                        {/* Modalidad */}
                        <div className="form-control w-full">
                            <label className="label"><span className="label-text font-semibold">Modalidad *</span></label>
                            <select
                                className={`select select-bordered w-full ${errors.mode ? 'select-error' : ''}`}
                                value={data.mode}
                                onChange={e => setData('mode', e.target.value)}
                            >
                                <option value="presencial">Presencial</option>
                                <option value="virtual">Virtual</option>
                                <option value="hibrida">Híbrida</option>
                            </select>
                            {errors.mode && <span className="text-error text-sm mt-1">{errors.mode}</span>}
                        </div>

                        {/* Ubicación o link */}
                        <div className="form-control w-full md:col-span-2">
                            <label className="label">
                                <span className="label-text font-semibold">Ubicación física o enlace (Teams/Zoom/Meet)</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ej: Sala de reuniones piso 2, o https://meet..."
                                className={`input input-bordered w-full ${errors.location_link ? 'input-error' : ''}`}
                                value={data.location_link}
                                onChange={e => setData('location_link', e.target.value)}
                            />
                            {errors.location_link && <span className="text-error text-sm mt-1">{errors.location_link}</span>}
                        </div>

                        {/* Descripción y objetivos */}
                        <div className="form-control w-full md:col-span-2">
                            <label className="label">
                                <span className="label-text font-semibold">Descripción o agenda resumida *</span>
                            </label>
                            <textarea
                                className={`textarea textarea-bordered h-24 ${errors.description ? 'textarea-error' : ''}`}
                                placeholder="Indique los objetivos principales de la reunión..."
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                            ></textarea>
                            {errors.description && <span className="text-error text-sm mt-1">{errors.description}</span>}
                        </div>

                    </div>

                    <div className="divider"></div>

                    <div className="flex justify-end gap-2">
                        <Link href={route('meetings.index')} className="btn btn-ghost">Cancelar</Link>
                        <button type="submit" className="btn btn-primary" disabled={processing}>
                            {processing ? <span className="loading loading-spinner"></span> : <IconDeviceFloppy size={20} />}
                            Guardar Reunión
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
