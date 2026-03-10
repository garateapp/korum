import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { IconArrowLeft, IconPlus, IconTrash, IconDeviceFloppy, IconFileDescription, IconCalendar, IconClock, IconUsers } from '@tabler/icons-react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

export default function Create({ auth, meeting, users, departments, minute = null }) {
    const initialAgreements = minute?.agreements?.map((agreement) => ({
        subject: agreement.subject ?? '',
        responsible_ids: agreement.responsibles?.length
            ? agreement.responsibles.map((responsible) => responsible.id)
            : (agreement.responsible_id ? [agreement.responsible_id] : []),
        commitment_date: agreement.commitment_date ?? '',
        department_id: agreement.department_id ?? '',
    })) ?? [];

    const initialDecisions = minute?.decisions?.map((decision) => ({
        description: decision.description ?? '',
    })) ?? [];

    const minuteTopics = minute?.topics?.map((topic) => ({
        title: topic.title ?? '',
        detail: topic.detail ?? '',
        conclusions: topic.conclusions ?? '',
    })) ?? [];

    const agendaPrefillTopics = (meeting?.agenda_items ?? []).map((agendaItem) => ({
        title: agendaItem.title ?? '',
        detail: agendaItem.description ?? '',
        conclusions: '',
    }));

    const initialTopics = minute ? minuteTopics : agendaPrefillTopics;

    const { data, setData, post, processing, errors, transform } = useForm({
        notes: minute?.summary ?? '',
        observations: minute?.general_observations ?? '',
        agreements: initialAgreements,
        decisions: initialDecisions,
        topics: initialTopics,
        action: 'draft',
    });

    const isDraft = minute?.status === 'draft';

    const addTopic = () => {
        setData('topics', [
            ...data.topics,
            { title: '', detail: '', conclusions: '' }
        ]);
    };

    const removeTopic = (index) => {
        const newTopics = [...data.topics];
        newTopics.splice(index, 1);
        setData('topics', newTopics);
    };

    const updateTopic = (index, field, value) => {
        const newTopics = [...data.topics];
        newTopics[index][field] = value;
        setData('topics', newTopics);
    };

    const addAgreement = () => {
        setData('agreements', [
            ...data.agreements,
            { subject: '', responsible_ids: [], commitment_date: '', department_id: '' }
        ]);
    };

    const removeAgreement = (index) => {
        const newAgreements = [...data.agreements];
        newAgreements.splice(index, 1);
        setData('agreements', newAgreements);
    };

    const updateAgreement = (index, field, value) => {
        const newAgreements = [...data.agreements];
        newAgreements[index][field] = value;
        setData('agreements', newAgreements);
    };

    const addDecision = () => {
        setData('decisions', [
            ...data.decisions,
            { description: '' }
        ]);
    };

    const removeDecision = (index) => {
        const newDecisions = [...data.decisions];
        newDecisions.splice(index, 1);
        setData('decisions', newDecisions);
    };

    const updateDecision = (index, value) => {
        const newDecisions = [...data.decisions];
        newDecisions[index].description = value;
        setData('decisions', newDecisions);
    };

    const submit = (e, action = 'publish') => {
        e.preventDefault();

        transform((formData) => ({
            ...formData,
            action,
        }));

        post(route('meetings.minute.store', meeting.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout header="Preparar Minuta">
            <Head title="Preparar Minuta" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Minuta de Reunión: {meeting.code}</h2>
                    <p className="text-sm text-gray-500">{meeting.subject}</p>
                    {isDraft && (
                        <p className="text-xs font-bold uppercase tracking-wider text-warning mt-1">
                            Borrador guardado
                        </p>
                    )}
                </div>
                <Link href={route('meetings.show', meeting.id)} className="btn btn-ghost">
                    <IconArrowLeft size={20} /> Cancelar
                </Link>
            </div>

            <form onSubmit={(e) => submit(e, 'publish')} className="space-y-6 pb-20">
                {(errors.error || errors.action) && (
                    <div className="alert alert-error">
                        <span>{errors.error || errors.action}</span>
                    </div>
                )}

                {/* Resumen e Información General */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">

                        {/* Resumen de temas tratados */}
                        <div className="bg-base-100 shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><IconFileDescription /> Resumen de la Reunión</h3>
                            <div className="bg-base-100 shadow-sm sm:rounded-lg p-6">
                                <label className="label"><span className="label-text font-semibold">Desarrollo y temas tratados *</span></label>
                                <div data-color-mode="light">
                                    <MDEditor
                                        value={data.notes}
                                        onChange={(value) => setData('notes', value ?? '')}
                                        preview="edit"
                                        height={280}
                                        visibleDragbar={false}
                                        textareaProps={{
                                            placeholder: 'Describa los puntos principales discutidos...',
                                        }}
                                    />
                                </div>
                                {errors.notes && <span className="text-error text-sm mt-1">{errors.notes}</span>}
                            </div>

                            {/* Temas Detallados */}
                            <div className="bg-base-100 shadow-sm sm:rounded-lg p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold flex items-center gap-2"><IconFileDescription /> Puntos de Discusión (Opcional)</h3>
                                    <button type="button" onClick={addTopic} className="btn btn-sm btn-ghost text-primary">
                                        <IconPlus size={16} /> Añadir Tema
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    {data.topics.map((topic, index) => (
                                        <div key={index} className="p-4 border rounded-lg bg-base-100 relative group">
                                            <button type="button" onClick={() => removeTopic(index)} className="btn btn-circle btn-xs btn-ghost text-error absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                                                <IconTrash size={14} />
                                            </button>
                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    className="input input-bordered input-sm w-full font-bold"
                                                    placeholder="Título del Tema (ej: Revisión de presupuesto)"
                                                    value={topic.title}
                                                    onChange={e => updateTopic(index, 'title', e.target.value)}
                                                />
                                                <textarea
                                                    className="textarea textarea-bordered textarea-sm w-full h-20"
                                                    placeholder="Detalle de la discusión..."
                                                    value={topic.detail}
                                                    onChange={e => updateTopic(index, 'detail', e.target.value)}
                                                ></textarea>
                                                <textarea
                                                    className="textarea textarea-bordered textarea-sm w-full h-16 bg-success/5 border-success/20"
                                                    placeholder="Conclusiones o decisiones de este punto..."
                                                    value={topic.conclusions}
                                                    onChange={e => updateTopic(index, 'conclusions', e.target.value)}
                                                ></textarea>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Acuerdos y Tareas */}
                        <div className="bg-base-100 shadow-sm sm:rounded-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold flex items-center gap-2"><IconUsers /> Acuerdos y Compromisos</h3>
                                <button type="button" onClick={addAgreement} className="btn btn-sm btn-primary">
                                    <IconPlus size={16} /> Nuevo Acuerdo
                                </button>
                            </div>
                            {errors.agreements && (
                                <div className="alert alert-warning mb-4">
                                    <span>{errors.agreements}</span>
                                </div>
                            )}

                            {data.agreements.length > 0 ? (
                                <div className="space-y-6">
                                    {data.agreements.map((agreement, index) => (
                                        <div key={index} className="p-4 border rounded-lg bg-base-200 relative">
                                            <button
                                                type="button"
                                                onClick={() => removeAgreement(index)}
                                                className="btn btn-circle btn-xs btn-error absolute -top-2 -right-2"
                                            >
                                                <IconTrash size={14} />
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="form-control md:col-span-2">
                                                    <label className="label"><span className="label-text text-xs font-bold uppercase">Descripción del Acuerdo</span></label>
                                                    <div data-color-mode="light">
                                                        <MDEditor
                                                            preview="edit"
                                                            height={220}
                                                            visibleDragbar={false}
                                                            value={agreement.subject}
                                                            onChange={(value) => updateAgreement(index, 'subject', value ?? '')}
                                                            textareaProps={{
                                                                placeholder: 'Detalle del acuerdo, alcance y entregables...',
                                                            }}
                                                        />
                                                    </div>
                                                    {errors[`agreements.${index}.subject`] && (
                                                        <span className="text-error text-xs mt-1">{errors[`agreements.${index}.subject`]}</span>
                                                    )}
                                                </div>
                                                <div className="form-control md:col-span-2">
                                                    <label className="label"><span className="label-text text-xs font-bold uppercase text-primary">Responsables (Invitados)</span></label>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-base-100 rounded-xl border border-base-300 max-h-40 overflow-y-auto">
                                                        {users.map(u => (
                                                            <label key={u.id} className="label cursor-pointer justify-start gap-2 hover:bg-base-200 p-1 rounded-lg transition-colors">
                                                                <input
                                                                    type="checkbox"
                                                                    className="checkbox checkbox-primary checkbox-xs"
                                                                    checked={agreement.responsible_ids.includes(u.id.toString()) || agreement.responsible_ids.includes(u.id)}
                                                                    onChange={(e) => {
                                                                        const ids = [...agreement.responsible_ids];
                                                                        if (e.target.checked) {
                                                                            ids.push(u.id);
                                                                        } else {
                                                                            const index = ids.indexOf(u.id);
                                                                            if (index > -1) ids.splice(index, 1);
                                                                            // also check for string id
                                                                            const sIndex = ids.indexOf(u.id.toString());
                                                                            if (sIndex > -1) ids.splice(sIndex, 1);
                                                                        }
                                                                        updateAgreement(index, 'responsible_ids', ids);
                                                                    }}
                                                                />
                                                                <span className="label-text text-[10px] font-bold truncate">{u.name}</span>
                                                            </label>
                                                        ))}
                                                        {users.length === 0 && (
                                                            <p className="text-xs opacity-60 col-span-2 sm:col-span-3">
                                                                No hay invitados internos disponibles para asignar.
                                                            </p>
                                                        )}
                                                    </div>
                                                    {errors[`agreements.${index}.responsible_ids`] && <span className="text-error text-xs mt-1">{errors[`agreements.${index}.responsible_ids`]}</span>}
                                                </div>
                                                <div className="form-control">
                                                    <label className="label"><span className="label-text text-xs font-bold uppercase">Fecha Compromiso</span></label>
                                                    <input
                                                        type="date"
                                                        className="input input-bordered input-sm"
                                                        value={agreement.commitment_date}
                                                        onChange={e => updateAgreement(index, 'commitment_date', e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-control">
                                                    <label className="label"><span className="label-text text-xs font-bold uppercase">Área / Departamento</span></label>
                                                    <select
                                                        className="select select-bordered select-sm"
                                                        value={agreement.department_id}
                                                        onChange={e => updateAgreement(index, 'department_id', e.target.value)}
                                                    >
                                                        <option value="">Seleccione...</option>
                                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 border-2 border-dashed rounded-lg text-gray-400">
                                    Haga clic en "Nuevo Acuerdo" para registrar tareas y responsables.
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="space-y-6">

                        {/* Decisiones Tomadas */}
                        <div className="bg-base-100 shadow-sm sm:rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold flex items-center gap-2"><IconCalendar /> Decisiones</h3>
                                <button type="button" onClick={addDecision} className="btn btn-sm btn-outline">
                                    <IconPlus size={16} />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {data.decisions.map((decision, index) => (
                                    <div key={index} className="flex gap-2">
                                        <textarea
                                            className="textarea textarea-bordered textarea-sm w-full"
                                            placeholder="Describa la decisión..."
                                            value={decision.description}
                                            onChange={e => updateDecision(index, e.target.value)}
                                        ></textarea>
                                        <button type="button" onClick={() => removeDecision(index)} className="btn btn-ghost btn-xs text-error">
                                            <IconTrash size={16} />
                                        </button>
                                    </div>
                                ))}
                                {data.decisions.length === 0 && <p className="text-center text-sm text-gray-400">No hay decisiones registradas.</p>}
                            </div>
                        </div>

                        {/* Info de la Reunión (Referencia) */}
                        <div className="bg-base-200 shadow-sm sm:rounded-lg p-6">
                            <h3 className="font-bold text-sm uppercase text-gray-500 mb-4">Referencia Reunión</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2"><IconCalendar size={16} /> {meeting.date}</div>
                                <div className="flex items-center gap-2"><IconClock size={16} /> {meeting.start_time.substring(0, 5)} - {meeting.end_time.substring(0, 5)}</div>
                                <div className="divider"></div>
                                <p className="font-bold">Participantes ({meeting.participants?.length || 0}):</p>
                                <ul className="list-disc list-inside text-xs opacity-80">
                                    {meeting.participants?.map(p => (
                                        <li key={p.id}>{p.user ? p.user.name : p.external_name}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Flotante para Guardar */}
                <div className="fixed bottom-0 left-0 right-0 bg-base-100 border-t p-4 z-50 flex justify-center lg:ml-72">
                    <div className="max-w-4xl w-full flex justify-between items-center px-4">
                        <div className="text-sm text-gray-500 hidden md:block">
                            Puedes guardar como <strong>borrador</strong> y publicar cuando esté completa.
                        </div>
                        <div className="flex gap-2 flex-1 md:flex-initial">
                            <Link href={route('meetings.show', meeting.id)} className="btn btn-ghost flex-1 md:flex-initial">Cancelar</Link>
                            <button
                                type="button"
                                className="btn btn-outline flex-1 md:flex-initial"
                                disabled={processing}
                                onClick={(e) => submit(e, 'draft')}
                            >
                                {processing ? <span className="loading loading-spinner"></span> : <IconDeviceFloppy size={20} />}
                                Guardar borrador
                            </button>
                            <button type="submit" className="btn btn-primary flex-1 md:flex-initial" disabled={processing}>
                                {processing ? <span className="loading loading-spinner"></span> : <IconDeviceFloppy size={20} />}
                                Publicar Minuta
                            </button>
                        </div>
                    </div>
                </div>

            </form>
        </AuthenticatedLayout>
    );
}
