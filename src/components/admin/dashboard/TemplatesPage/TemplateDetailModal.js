'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Calendar, Tag, Clock, CheckCircle, AlertCircle, Trash2, Edit, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function TemplateDetailModal({ template, isOpen, onClose }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    if (!isOpen || !template)
        return null;
    const IconComponent = template.icon;
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-emerald-500';
            case 'coming-soon':
                return 'bg-amber-500';
            case 'draft':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }
    };
    const getStatusText = (status) => {
        switch (status) {
            case 'active':
                return 'Disponible';
            case 'coming-soon':
                return 'Próximamente';
            case 'draft':
                return 'Borrador';
            default:
                return 'Desconocido';
        }
    };
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'active':
                return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400';
            case 'coming-soon':
                return 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400';
            case 'draft':
                return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400';
            default:
                return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400';
        }
    };
    const handleDelete = () => {
        setIsDeleting(true);
        // Simulación de eliminación
        setTimeout(() => {
            setIsDeleting(false);
            onClose();
        }, 1500);
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm", children: _jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-300", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300", children: _jsx(IconComponent, { className: "h-6 w-6", strokeWidth: 1.5 }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-gray-100", children: template.name }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: template.category })] })] }), _jsx("button", { onClick: onClose, className: "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors", children: _jsx(X, { className: "h-5 w-5 text-gray-500 dark:text-gray-400", strokeWidth: 1.5 }) })] }), _jsx("div", { className: "p-6 overflow-y-auto max-h-[calc(90vh-180px)]", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-3 h-3 rounded-full ${getStatusColor(template.status)}` }), _jsx("span", { className: `text-sm px-2 py-1 rounded font-medium ${getStatusBadgeClass(template.status)}`, children: getStatusText(template.status) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400 mb-2", children: "Descripci\u00F3n" }), _jsx("p", { className: "text-gray-900 dark:text-gray-100 leading-relaxed", children: template.description })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "Detalles" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Tag, { className: "w-4 h-4 text-gray-500", strokeWidth: 1.5 }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Categor\u00EDa" })] }), _jsx("span", { className: "text-sm text-gray-900 dark:text-gray-100 font-medium", children: template.category })] }), template.createdAt && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "w-4 h-4 text-gray-500", strokeWidth: 1.5 }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Creaci\u00F3n" })] }), _jsx("span", { className: "text-sm text-gray-900 dark:text-gray-100", children: new Date(template.createdAt).toLocaleDateString('es-ES', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                }) })] })), template.updatedAt && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "w-4 h-4 text-gray-500", strokeWidth: 1.5 }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Actualizaci\u00F3n" })] }), _jsx("span", { className: "text-sm text-gray-900 dark:text-gray-100", children: new Date(template.updatedAt).toLocaleDateString('es-ES', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                }) })] }))] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "Compatibilidad" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-4 h-4 text-emerald-500", strokeWidth: 1.5 }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Contenido web" })] }), _jsx("span", { className: "text-sm text-emerald-500 font-medium", children: "Compatible" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-4 h-4 text-emerald-500", strokeWidth: 1.5 }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "API" })] }), _jsx("span", { className: "text-sm text-emerald-500 font-medium", children: "Compatible" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4 text-amber-500", strokeWidth: 1.5 }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "M\u00F3vil" })] }), _jsx("span", { className: "text-sm text-amber-500 font-medium", children: "Parcial" })] })] })] })] })] }) }), _jsxs("div", { className: "p-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between", children: [_jsx("div", { children: template.status === 'active' && (_jsx(Button, { variant: "default", className: "bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900", onClick: () => {
                                    // Navegar a la página de creación según el tipo de plantilla
                                    if (template.category === 'Turismo') {
                                        router.push('/admin/dashboard/templates/tourism/create');
                                    }
                                    else {
                                        // Para otras plantillas, navegar a una página genérica
                                        router.push('/admin/dashboard/templates/create');
                                    }
                                    onClose(); // Cerrar el modal después de navegar
                                }, children: "Usar plantilla" })) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs(Button, { variant: "outline", className: "border-gray-300 dark:border-gray-700", children: [_jsx(Copy, { className: "h-4 w-4 mr-2", strokeWidth: 1.5 }), "Duplicar"] }), _jsxs(Button, { variant: "outline", className: "border-gray-300 dark:border-gray-700", onClick: () => {
                                        // Navegar a la página de edición según el tipo de plantilla
                                        if (template.category === 'Turismo') {
                                            router.push('/admin/dashboard/templates/tourism');
                                        }
                                        else {
                                            router.push('/admin/dashboard/templates');
                                        }
                                        onClose(); // Cerrar el modal después de navegar
                                    }, children: [_jsx(Edit, { className: "h-4 w-4 mr-2", strokeWidth: 1.5 }), "Editar"] }), _jsxs(Button, { variant: "outline", className: "border-red-300 hover:border-red-400 text-red-600 hover:text-red-700 dark:border-red-900 dark:hover:border-red-800 dark:text-red-500 dark:hover:text-red-400", onClick: handleDelete, disabled: isDeleting, children: [isDeleting ? (_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-2 border-red-200 border-t-red-600 dark:border-red-900 dark:border-t-red-500 mr-2" })) : (_jsx(Trash2, { className: "h-4 w-4 mr-2", strokeWidth: 1.5 })), isDeleting ? 'Eliminando...' : 'Eliminar'] })] })] })] }) }));
}
//# sourceMappingURL=TemplateDetailModal.js.map