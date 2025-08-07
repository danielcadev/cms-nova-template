import React from 'react';
import Link from 'next/link';
import { 
  Plus, 
  FileText, 
  Database, 
  Layout,
  ArrowRight,
  Calendar,
  Users,
  TrendingUp,
  Eye,
  Edit3,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ContentType {
  id: string;
  name: string;
  apiIdentifier: string;
  description?: string | null;
  _count: {
    entries: number;
  };
  entries: any[];
}

export interface Plan {
  id: string;
  mainTitle: string;
  createdAt: Date;
}

export interface ViewContentProps {
  contentTypes: ContentType[];
  plans: Plan[];
  allContentEntries: any[];
}



// Editorial content card component
const ContentCard = ({ icon: Icon, title, description, count, action, href }: {
  icon: React.ElementType;
  title: string;
  description: string;
  count: number;
  action: string;
  href: string;
}) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700">
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
      </div>
      <div className="text-right">
        <span className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{count}</span>
        <p className="text-xs text-gray-500 dark:text-gray-500">elementos</p>
      </div>
    </div>
    
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
      {title}
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
      {description}
    </p>
    
    <Link href={href}>
      <Button className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 transition-all duration-200 font-medium">
        <span>{action}</span>
        <ArrowRight className="h-4 w-4 ml-2" strokeWidth={1.5} />
      </Button>
    </Link>
  </div>
);

// Editorial template card component
const RecentTemplateCard = ({ template }: { template: Plan }) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700">
    <div className="flex items-start justify-between mb-3">
      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <Layout className="h-4 w-4 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
      </div>
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
        Activo
      </span>
    </div>
    
    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
      {template.mainTitle}
    </h4>
    
    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mb-4">
      <Calendar className="h-3 w-3" strokeWidth={1.5} />
      <span>{new Date(template.createdAt).toLocaleDateString('es-ES')}</span>
    </div>
    
    <div className="flex gap-2">
      <Link href={`/admin/dashboard/templates/tourism/edit/${template.id}`} className="flex-1">
        <Button variant="outline" size="sm" className="w-full border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 font-medium">
          <Eye className="h-3 w-3 mr-2" strokeWidth={1.5} />
          Ver
        </Button>
      </Link>
      <Link href={`/admin/dashboard/templates/tourism/edit/${template.id}`}>
        <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 font-medium">
          <Edit3 className="h-3 w-3" strokeWidth={1.5} />
        </Button>
      </Link>
    </div>
  </div>
);

export function ViewContentComponent({ contentTypes, plans, allContentEntries }: ViewContentProps) {
  // Cálculos de métricas
  const totalContent = allContentEntries?.length || 0;
  const totalTemplates = plans?.length || 0;
  const totalContentTypes = contentTypes?.length || 0;
  
  // Plantillas recientes (últimas 3)
  const recentTemplates = plans?.slice(0, 3) || [];

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
                  Contenido
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 font-light tracking-wide">
                  Gestiona, crea y organiza todo tu contenido desde un solo lugar
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/admin/dashboard/content-types/create">
                  <Button className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" strokeWidth={1.5} />
                      Crear contenido
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Editorial Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div className="text-right">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{totalContent}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total contenido</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2" />
                <div className="text-right">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{totalTemplates}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Plantillas</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
                <div className="text-right">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{totalContentTypes}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Tipos de contenido</div>
                </div>
              </div>
            </div>
          </div>

          {/* Secciones principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            {/* CMS Flexible */}
            <ContentCard
              icon={Database}
              title="CMS Flexible"
              description="Crea y gestiona tipos de contenido personalizados con campos flexibles y dinámicos"
              count={totalContentTypes}
              action="Gestionar Contenido"
              href="/admin/dashboard/content-types"
            />

            {/* Plantillas */}
            <ContentCard
              icon={Layout}
              title="Plantillas"
              description="Diseña y administra plantillas predefinidas para crear contenido de manera rápida y consistente"
              count={totalTemplates}
              action="Ver Plantillas"
              href="/admin/dashboard/templates"
            />
          </div>

          {/* Plantillas recientes */}
          {recentTemplates.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                  Plantillas Recientes
                </h2>
                <Link href="/admin/dashboard/templates">
                  <Button variant="outline" className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 font-medium">
                    Ver todas
                    <ArrowRight className="h-4 w-4 ml-2" strokeWidth={1.5} />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentTemplates.map((template) => (
                  <RecentTemplateCard key={template.id} template={template} />
                ))}
              </div>
            </div>
          )}

          {/* Acciones rápidas */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
                Acciones Rápidas
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Accede rápidamente a las funciones más utilizadas
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/dashboard/content-types/create">
                <Button className="w-full h-16 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 transition-all duration-200 font-medium">
                  <Plus className="h-5 w-5 mr-3" strokeWidth={1.5} />
                  <span>Crear Tipo</span>
                </Button>
              </Link>
              
              <Link href="/admin/dashboard/templates">
                <Button variant="outline" className="w-full h-16 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 font-medium">
                  <Layout className="h-5 w-5 mr-3" strokeWidth={1.5} />
                  <span>Ver Plantillas</span>
                </Button>
              </Link>
              
              <Link href="/admin/dashboard/content-types">
                <Button variant="outline" className="w-full h-16 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 font-medium">
                  <Layers className="h-5 w-5 mr-3" strokeWidth={1.5} />
                  <span>Gestionar Todo</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
