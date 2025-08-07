import { Layers, Sparkles, Zap, Database, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CreateContentTypeHeaderProps {
  isEditing?: boolean;
}

export function CreateContentTypeHeader({ isEditing = false }: CreateContentTypeHeaderProps) {
  return (
    <div className="mb-16">
      {/* Editorial Navigation */}
      <div className="flex items-center gap-3 mb-12">
        <Link href="/admin/dashboard/content-types">
          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200">
            <ArrowLeft className="h-4 w-4 mr-2" strokeWidth={1.5} />
            Tipos de Contenido
          </Button>
        </Link>
        <span className="text-gray-400 dark:text-gray-600">/</span>
        <span className="text-gray-600 dark:text-gray-400 font-medium">Crear Nuevo</span>
      </div>

      {/* Editorial Header */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
            <Layers className="h-6 w-6 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-4xl lg:text-5xl font-medium text-gray-900 dark:text-gray-100 tracking-tight">
              {isEditing ? 'Editar Tipo de Contenido' : 'Crear Tipo de Contenido'}
            </h1>
          </div>
        </div>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
          {isEditing 
            ? 'Modifica la estructura y campos de tu tipo de contenido. Actualiza validaciones, tipos de datos y organización.'
            : 'Define la estructura y campos personalizados para tu nuevo tipo de contenido. Configura validaciones, tipos de datos y organización.'
          }
        </p>
      </div>

      {/* Editorial Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
            <Sparkles className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">Campos Dinámicos</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Crea campos personalizados: texto, números, fechas, imágenes y más tipos de datos</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
            <Zap className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">Validación Inteligente</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Reglas de validación automáticas que se adaptan al tipo de campo seleccionado</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
            <Database className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">Estructura Flexible</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Diseña la estructura perfecta que se adapte a tus necesidades de contenido</p>
        </div>
      </div>
    </div>
  );
}