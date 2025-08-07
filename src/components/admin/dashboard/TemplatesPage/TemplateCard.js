'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MoreHorizontal, Eye, Calendar, Tag, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
export function TemplateCard({ template, index, onViewDetails }) {
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
    const CardContent = () => (_jsxs("div", { className: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 hover:border-gray-300 dark:hover:border-gray-700", children: [_jsxs("div", { className: "flex items-start justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300", children: _jsx(IconComponent, { className: "h-6 w-6", strokeWidth: 1.5 }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("h3", { className: "text-base font-semibold text-gray-900 dark:text-gray-100 leading-tight", children: template.name }), _jsx("div", { className: cn("w-2 h-2 rounded-full", getStatusColor(template.status)) })] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: template.category })] })] }), _jsx(Button, { variant: "ghost", size: "sm", className: "opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 p-0", onClick: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }, children: _jsx(MoreHorizontal, { className: "h-4 w-4 text-gray-500", strokeWidth: 1.5 }) })] }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed line-clamp-2", children: template.description }), _jsxs("div", { className: "space-y-3 mb-6", children: [template.contentCount !== undefined && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(FileText, { className: "w-4 h-4 text-gray-500", strokeWidth: 1.5 }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Contenidos" })] }), _jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: template.contentCount })] })), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Tag, { className: "w-4 h-4 text-gray-500", strokeWidth: 1.5 }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Categor\u00EDa" })] }), _jsx("span", { className: "text-sm text-gray-900 dark:text-gray-100", children: template.category })] }), template.createdAt && template.status !== 'coming-soon' && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "w-4 h-4 text-gray-500", strokeWidth: 1.5 }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Creaci\u00F3n" })] }), _jsx("span", { className: "text-sm text-gray-900 dark:text-gray-100", children: new Date(template.createdAt).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                }) })] })), template.status === 'coming-soon' && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "w-4 h-4 text-amber-500", strokeWidth: 1.5 }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Estado" })] }), _jsx("span", { className: "text-sm text-amber-600 dark:text-amber-400 font-medium", children: "En desarrollo" })] }))] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: `text-xs px-2 py-1 rounded font-medium ${getStatusBadgeClass(template.status)}`, children: getStatusText(template.status) }), _jsxs("div", { className: "flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200", children: [_jsx("button", { onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onViewDetails(template);
                                }, className: "px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-all duration-200", children: _jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx(Eye, { className: "h-4 w-4", strokeWidth: 1.5 }), _jsx("span", { children: "Detalles" })] }) }), template.status === 'active' && template.route && (_jsxs("div", { className: "flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400", children: [_jsx(ArrowRight, { className: "h-3 w-3", strokeWidth: 1.5 }), _jsx("span", { children: "Abrir" })] }))] })] })] }));
    return (_jsx("div", { className: "group cursor-pointer", style: { animationDelay: `${index * 100}ms` }, children: template.status === 'active' && template.route ? (_jsx(Link, { href: template.route, children: _jsx(CardContent, {}) })) : (_jsx("div", { onClick: () => onViewDetails(template), children: _jsx(CardContent, {}) })) }));
}
//# sourceMappingURL=TemplateCard.js.map