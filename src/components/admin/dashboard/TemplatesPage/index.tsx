'use client';

import { useState, useEffect } from 'react';
import { 
    FileText, 
    UtensilsCrossed, 
    PlusCircle, 
    Plus, 
    RefreshCw, 
    MapPin, 
    Calendar,
    Eye,
    ArrowRight,
    Clock,
    TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TemplateCard } from './TemplateCard';
import { TemplateDetailModal } from './TemplateDetailModal';
import Link from 'next/link';

export interface Template {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'draft' | 'coming-soon';
    icon: any;
    category: string;
    createdAt?: string;
    updatedAt?: string;
    contentCount?: number;
    route?: string;
}

interface RecentContent {
    id: string;
    title: string;
    type: string;
    status: 'published' | 'draft';
    createdAt: string;
    author: string;
    route: string;
}

export function TemplatesPage() {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recentContent, setRecentContent] = useState<RecentContent[]>([]);

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
                        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 6)
                        .map((plan: any) => ({
                            id: plan.id,
                            title: plan.mainTitle || 'Plan sin título',
                            type: 'Plan Turístico',
                            status: plan.published ? 'published' : 'draft',
                            createdAt: plan.createdAt,
                            author: 'Admin', // You can add author field to your plan model later
                            route: `/admin/dashboard/templates/tourism/edit/${plan.id}`
                        }));
                    
                    setRecentContent(recentPlans);
                } else {
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
                } catch (error) {
                    console.error('Error fetching content types:', error);
                }
                
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
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

    const templates: Template[] = [
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
    const filteredTemplates = templates.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 6)
                    .map((plan: any) => ({
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
            } catch (error) {
                console.error('Error refreshing content types:', error);
            }
            
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleViewDetails = (template: Template) => {
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
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900 dark:border-gray-700 dark:border-t-gray-100 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400 text-center text-sm">Cargando plantillas...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 relative">
            {/* Clean editorial background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-gray-950 dark:to-gray-900/50" />

            <div className="relative z-10 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Editorial header */}
                    <div className="mb-16">
                        <div className="flex items-start justify-between mb-12">
                            <div className="space-y-4">
                                <h1 className="text-4xl lg:text-5xl font-medium text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
                                    Plantillas
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400 font-light tracking-wide">
                                    Gestiona tus plantillas y contenido creado
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="flex items-center gap-2">
                                        <RefreshCw className={`h-4 w-4 transition-transform duration-200 ${isRefreshing ? 'animate-spin' : ''}`} strokeWidth={1.5} />
                                        {isRefreshing ? 'Actualizando...' : 'Actualizar'}
                                    </div>
                                </button>
                                <button
                                    onClick={handleCreateTemplate}
                                    className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" strokeWidth={1.5} />
                                        Nueva plantilla
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Editorial Stats cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                                <div className="text-right">
                                    <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{stats.total}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Plantillas</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2" />
                                <div className="text-right">
                                    <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{stats.active}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Activas</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                                <div className="text-right">
                                    <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{stats.totalContent}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Contenidos</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
                                <div className="text-right">
                                    <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{stats.comingSoon}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Próximamente</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Content Section */}
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight mb-2">
                                    Contenido Reciente
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Últimos contenidos creados con tus plantillas
                                </p>
                            </div>
                            {recentContent.length > 0 && (
                                <Link href="/admin/dashboard/templates/tourism">
                                    <Button variant="outline" className="border-gray-300 dark:border-gray-700">
                                        Ver todos
                                        <ArrowRight className="h-4 w-4 ml-2" strokeWidth={1.5} />
                                    </Button>
                                </Link>
                            )}
                        </div>
                        
                        {recentContent.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {recentContent.slice(0, 6).map((content) => (
                                    <Link key={content.id} href={content.route}>
                                        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700 cursor-pointer group">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                                        <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                            {content.type}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                    content.status === 'published' 
                                                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                                        : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                                                }`}>
                                                    {content.status === 'published' ? 'Publicado' : 'Borrador'}
                                                </span>
                                            </div>
                                            
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {content.title}
                                            </h3>
                                            
                                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-3 w-3" strokeWidth={1.5} />
                                                    <span>{new Date(content.createdAt).toLocaleDateString('es-ES', {
                                                        day: 'numeric',
                                                        month: 'short'
                                                    })}</span>
                                                </div>
                                                <span className="text-xs">por {content.author}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-900 rounded-xl p-12 border border-gray-200 dark:border-gray-800 shadow-sm text-center">
                                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                                    <FileText className="w-8 h-8 text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
                                    No hay contenido reciente
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                    Comienza creando tu primer plan turístico o contenido personalizado
                                </p>
                                <div className="flex items-center justify-center gap-3">
                                    <Link href="/admin/dashboard/templates/tourism/create">
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                            <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
                                            Crear Plan Turístico
                                        </Button>
                                    </Link>
                                    <Link href="/admin/dashboard/content-types/create">
                                        <Button variant="outline" className="border-gray-300 dark:border-gray-700">
                                            <PlusCircle className="h-4 w-4 mr-2" strokeWidth={1.5} />
                                            Crear Contenido
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Templates Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight mb-2">
                                    Plantillas Disponibles
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Estructuras predefinidas para crear contenido rápidamente
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Templates grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTemplates.map((template, index) => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                index={index}
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                    </div>

                    {/* Empty state */}
                    {filteredTemplates.length === 0 && (
                        <div className="text-center py-20 px-4">
                            <div className="max-w-md mx-auto">
                                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                                    <FileText className="w-8 h-8 text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
                                </div>

                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
                                    No se encontraron plantillas
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                    {searchTerm ?
                                        `No hay plantillas que coincidan con "${searchTerm}".` :
                                        "Aún no hay plantillas disponibles. Crea una nueva para comenzar."}
                                </p>

                                <Button
                                    onClick={handleCreateTemplate}
                                    className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
                                    Nueva plantilla
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Template Detail Modal */}
                    <TemplateDetailModal
                        template={selectedTemplate}
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                    />
                </div>
            </div>
        </div>
    );
}