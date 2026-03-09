import { useForm } from '@inertiajs/react';
import { FileText, Upload, Trash2, Download, FileUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResourceFolder({ title, type, id, attachments = [] }) {
    const { data, setData, post, processing, reset, delete: destroy } = useForm({
        file: null,
        attachable_type: type,
        attachable_id: id,
    });

    const handleUpload = (e) => {
        e.preventDefault();
        if (!data.file) return;

        post(route('attachments.store'), {
            onSuccess: () => reset('file'),
        });
    };

    const handleDelete = (attachmentId) => {
        if (confirm('¿Estás seguro de eliminar este archivo?')) {
            destroy(route('attachments.destroy', attachmentId));
        }
    };

    return (
        <div className="bento-card h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-xl">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h3 className="font-black text-sm uppercase tracking-wider">{title}</h3>
                        <p className="text-[10px] font-bold opacity-40">CARPETA VIRTUAL</p>
                    </div>
                </div>

                <label className="btn btn-primary btn-sm rounded-xl px-4 cursor-pointer">
                    <input
                        type="file"
                        className="hidden"
                        onChange={e => setData('file', e.target.files[0])}
                    />
                    <Upload size={14} />
                    <span className="hidden sm:inline">Subir</span>
                </label>
            </div>

            {data.file && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between"
                >
                    <div className="flex items-center gap-3 truncate">
                        <FileUp className="text-primary shrink-0" size={18} />
                        <span className="text-xs font-bold truncate">{data.file.name}</span>
                    </div>
                    <button
                        onClick={handleUpload}
                        disabled={processing}
                        className={`btn btn-xs btn-primary rounded-lg ${processing ? 'loading' : ''}`}
                    >
                        Confirmar
                    </button>
                </motion.div>
            )}

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                <AnimatePresence initial={false}>
                    {attachments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 opacity-20 italic text-center">
                            <FileText size={32} className="mb-2" />
                            <p className="text-xs font-bold">Sin documentos</p>
                        </div>
                    ) : (
                        attachments.map((file) => (
                            <motion.div
                                key={file.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group flex items-center justify-between p-3 rounded-xl border border-base-300 hover:border-primary/30 hover:bg-primary/5 transition-all"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-xs font-black uppercase text-base-content/40">
                                        {file.extension}
                                    </div>
                                    <div className="truncate">
                                        <p className="text-xs font-bold truncate leading-tight">{file.file_name}</p>
                                        <p className="text-[10px] opacity-40 font-bold">{file.size_kb} KB • {file.uploader?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a
                                        href={file.url}
                                        target="_blank"
                                        className="btn btn-ghost btn-xs btn-circle text-primary"
                                        title="Descargar"
                                    >
                                        <Download size={14} />
                                    </a>
                                    <button
                                        onClick={() => handleDelete(file.id)}
                                        className="btn btn-ghost btn-xs btn-circle text-error"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
