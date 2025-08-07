'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { FileText, UtensilsCrossed, PlusCircle, Plus, RefreshCw, MapPin, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TemplateCard } from './TemplateCard';
import { TemplateDetailModal } from './TemplateDetailModal';
import Link from 'next/link';
export function TemplatesPage() {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recentContent, setRecentContent] = useState([]);
    // Fetch real data from database
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // Fetch tourist plans from API
                const plansResponse = await fetch('/api/plans');
                if (plansResponse.ok) {
                    const plansData = await plansResponse.json();
                    const plans = plansData.plans || [];
                    // Update content counts
                    setContentCounts(prev => ({
                        ...prev,
                        touristPlans: plans.length
                    }));
                    // Transform plans data to recent content format
                    const recentPlans = plans
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 6)
                        .map((plan) => ({
                        id: plan.id,
                        title: plan.mainTitle || 'Plan sin título',
                        type: 'Plan Turístico',
                        status: plan.published ? 'published' : 'draft',
                        createdAt: plan.createdAt,
                        author: 'Admin', // You can add author field to your plan model later
                        route: `/admin/dashboard/templates/tourism/edit/${plan.id}`
                    }));
                    setRecentContent(recentPlans);
                }
                else {
                    console.error('Error fetching plans:', plansResponse.statusText);
                }
                // Fetch content types count
                try {
                    const contentTypesResponse = await fetch('/api/content-types');
                    if (contentTypesResponse.ok) {
                        const contentTypesData = await contentTypesResponse.json();
                        const contentTypes = contentTypesData.contentTypes || [];
                        setContentCounts(prev => ({
                            ...prev,
                            contentTypes: contentTypes.length
                        }));
                    }
                }
                catch (error) {
                    console.error('Error fetching content types:', error);
                }
            }
            catch (error) {
                console.error('Error loading data:', error);
            }
            finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);
    // State for real content counts
    const [contentCounts, setContentCounts] = useState({
        touristPlans: 0,
        contentTypes: 0
    });
    const templates = [
        {
            id: '1',
            name: 'Planes Turísticos',
            description: 'Estructura completa para crear itinerarios de viaje detallados',
            status: 'active',
            icon: FileText,
            category: 'Turismo',
            // No fecha ficticia - solo mostrar si hay fecha real
            contentCount: contentCounts.touristPlans,
            route: '/admin/dashboard/templates/tourism'
        },
        {
            id: '2',
            name: 'Restaurantes',
            description: 'Plantilla para menús y gestión de restaurantes',
            status: 'coming-soon',
            icon: UtensilsCrossed,
            category: 'Gastronomía',
            // No createdAt porque está "próximamente"
            contentCount: 0
        },
        {
            id: '3',
            name: 'Contenido Flexible',
            description: 'Crea tipos de contenido completamente personalizados',
            status: 'active',
            icon: PlusCircle,
            category: 'General',
            // No fecha ficticia - solo mostrar si hay fecha real
            contentCount: contentCounts.contentTypes,
            route: '/admin/dashboard/content-types'
        }
    ];
    // Filtrar plantillas
    const filteredTemplates = templates.filter(template => template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()));
    // Estadísticas
    const stats = {
        total: templates.length,
        active: templates.filter(t => t.status === 'active').length,
        comingSoon: templates.filter(t => t.status === 'coming-soon').length,
        totalContent: templates.reduce((acc, t) => acc + (t.contentCount || 0), 0)
    };
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            // Refresh tourist plans
            const plansResponse = await fetch('/api/plans');
            if (plansResponse.ok) {
                const plansData = await plansResponse.json();
                const plans = plansData.plans || [];
                // Update content counts
                setContentCounts(prev => ({
                    ...prev,
                    touristPlans: plans.length
                }));
                // Update recent content
                const recentPlans = plans
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 6)
                    .map((plan) => ({
                    id: plan.id,
                    title: plan.mainTitle || 'Plan sin título',
                    type: 'Plan Turístico',
                    status: plan.published ? 'published' : 'draft',
                    createdAt: plan.createdAt,
                    author: 'Admin',
                    route: `/admin/dashboard/templates/tourism/edit/${plan.id}`
                }));
                setRecentContent(recentPlans);
            }
            // Refresh content types count
            try {
                const contentTypesResponse = await fetch('/api/content-types');
                if (contentTypesResponse.ok) {
                    const contentTypesData = await contentTypesResponse.json();
                    const contentTypes = contentTypesData.contentTypes || [];
                    setContentCounts(prev => ({
                        ...prev,
                        contentTypes: contentTypes.length
                    }));
                }
            }
            catch (error) {
                console.error('Error refreshing content types:', error);
            }
        }
        catch (error) {
            console.error('Error refreshing data:', error);
        }
        finally {
            setIsRefreshing(false);
        }
    };
    const handleViewDetails = (template) => {
        setSelectedTemplate(template);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTemplate(null);
    };
    const handleCreateTemplate = () => {
        // Implementar lógica para crear nueva plantilla
        console.log('Crear nueva plantilla');
    };
    // Loading state
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950", children: _jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900 dark:border-gray-700 dark:border-t-gray-100 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 text-center text-sm", children: "Cargando plantillas..." })] }) }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 relative", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-gray-950 dark:to-gray-900/50" }), _jsx("div", { className: "relative z-10 p-8", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx("div", { className: "mb-16", children: _jsxs("div", { className: "flex items-start justify-between mb-12", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h1", { className: "text-4xl lg:text-5xl font-medium text-gray-900 dark:text-gray-100 tracking-tight leading-tight", children: "Plantillas" }), _jsx("p", { className: "text-lg text-gray-600 dark:text-gray-400 font-light tracking-wide", children: "Gestiona tus plantillas y contenido creado" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: handleRefresh, disabled: isRefreshing, className: "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(RefreshCw, { className: `h-4 w-4 transition-transform duration-200 ${isRefreshing ? 'animate-spin' : ''}`, strokeWidth: 1.5 }), isRefreshing ? 'Actualizando...' : 'Actualizar'] }) }), _jsx("button", { onClick: handleCreateTemplate, className: "bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Plus, { className: "h-4 w-4", strokeWidth: 1.5 }), "Nueva plantilla"] }) })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-16", children: [_jsx("div", { className: "bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200", children: _jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full mt-2" }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight", children: stats.total }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400 font-medium", children: "Plantillas" })] })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200", children: _jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("div", { className: "w-2 h-2 bg-emerald-500 rounded-full mt-2" }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight", children: stats.active }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400 font-medium", children: "Activas" })] })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200", children: _jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("div", { className: "w-2 h-2 bg-purple-500 rounded-full mt-2" }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight", children: stats.totalContent }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400 font-medium", children: "Contenidos" })] })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200", children: _jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("div", { className: "w-2 h-2 bg-amber-500 rounded-full mt-2" }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight", children: stats.comingSoon }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400 font-medium", children: "Pr\u00F3ximamente" })] })] }) })] }), _jsxs("div", { className: "mb-16", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight mb-2", children: "Contenido Reciente" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "\u00DAltimos contenidos creados con tus plantillas" })] }), recentContent.length > 0 && (_jsx(Link, { href: "/admin/dashboard/templates/tourism", children: _jsxs(Button, { variant: "outline", className: "border-gray-300 dark:border-gray-700", children: ["Ver todos", _jsx(ArrowRight, { className: "h-4 w-4 ml-2", strokeWidth: 1.5 })] }) }))] }), recentContent.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: recentContent.slice(0, 6).map((content) => (_jsx(Link, { href: content.route, children: _jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700 cursor-pointer group", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center", children: _jsx(MapPin, { className: "h-4 w-4 text-blue-600 dark:text-blue-400", strokeWidth: 1.5 }) }), _jsx("div", { children: _jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400 font-medium", children: content.type }) })] }), _jsx("span", { className: `text-xs px-2 py-1 rounded-full font-medium ${content.status === 'published'
                                                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                                                : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'}`, children: content.status === 'published' ? 'Publicado' : 'Borrador' })] }), _jsx("h3", { className: "font-semibold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors", children: content.title }), _jsxs("div", { className: "flex items-center justify-between text-sm text-gray-500 dark:text-gray-400", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "h-3 w-3", strokeWidth: 1.5 }), _jsx("span", { children: new Date(content.createdAt).toLocaleDateString('es-ES', {
                                                                        day: 'numeric',
                                                                        month: 'short'
                                                                    }) })] }), _jsxs("span", { className: "text-xs", children: ["por ", content.author] })] })] }) }, content.id))) })) : (_jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-xl p-12 border border-gray-200 dark:border-gray-800 shadow-sm text-center", children: [_jsx("div", { className: "w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-6", children: _jsx(FileText, { className: "w-8 h-8 text-gray-500 dark:text-gray-400", strokeWidth: 1.5 }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 tracking-tight", children: "No hay contenido reciente" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-6 leading-relaxed", children: "Comienza creando tu primer plan tur\u00EDstico o contenido personalizado" }), _jsxs("div", { className: "flex items-center justify-center gap-3", children: [_jsx(Link, { href: "/admin/dashboard/templates/tourism/create", children: _jsxs(Button, { className: "bg-blue-600 hover:bg-blue-700 text-white", children: [_jsx(Plus, { className: "h-4 w-4 mr-2", strokeWidth: 1.5 }), "Crear Plan Tur\u00EDstico"] }) }), _jsx(Link, { href: "/admin/dashboard/content-types/create", children: _jsxs(Button, { variant: "outline", className: "border-gray-300 dark:border-gray-700", children: [_jsx(PlusCircle, { className: "h-4 w-4 mr-2", strokeWidth: 1.5 }), "Crear Contenido"] }) })] })] }))] }), _jsx("div", { className: "mb-8", children: _jsx("div", { className: "flex items-center justify-between mb-8", children: _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight mb-2", children: "Plantillas Disponibles" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Estructuras predefinidas para crear contenido r\u00E1pidamente" })] }) }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredTemplates.map((template, index) => (_jsx(TemplateCard, { template: template, index: index, onViewDetails: handleViewDetails }, template.id))) }), filteredTemplates.length === 0 && (_jsx("div", { className: "text-center py-20 px-4", children: _jsxs("div", { className: "max-w-md mx-auto", children: [_jsx("div", { className: "w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-6", children: _jsx(FileText, { className: "w-8 h-8 text-gray-500 dark:text-gray-400", strokeWidth: 1.5 }) }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 tracking-tight", children: "No se encontraron plantillas" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-8 leading-relaxed", children: searchTerm ?
                                            `No hay plantillas que coincidan con "${searchTerm}".` :
                                            "Aún no hay plantillas disponibles. Crea una nueva para comenzar." }), _jsxs(Button, { onClick: handleCreateTemplate, className: "bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200", children: [_jsx(Plus, { className: "h-4 w-4 mr-2", strokeWidth: 1.5 }), "Nueva plantilla"] })] }) })), _jsx(TemplateDetailModal, { template: selectedTemplate, isOpen: isModalOpen, onClose: handleCloseModal })] }) })] }));
}
//# sourceMappingURL=index.js.map