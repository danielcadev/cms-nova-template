'use client';

import { 
  ArrowLeft, 
  MapPin, 
  Calendar,
  Eye,
  Plus,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Plan {
  id: string;
  mainTitle: string;
  destination: string;
  published: boolean;
  createdAt: string | Date;
}

interface TouristPlansViewProps {
  plans: Plan[];
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
}

export function TouristPlansView({ plans, isLoading, error, onBack }: TouristPlansViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header con navegación iOS */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50/80 rounded-2xl px-4 py-3 backdrop-blur-sm bg-white/80 border border-white/50 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Volver a Plantillas</span>
            </Button>
            
            <div className="w-px h-8 bg-gray-200" />
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Planes Turísticos</h1>
              <p className="text-gray-600">Gestiona tus itinerarios de viaje predefinidos</p>
            </div>
          </div>

          <Link href="/admin/dashboard/templates/tourism/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 py-4 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm">
              <Plus className="h-5 w-5" />
              <span className="font-semibold">Crear Nuevo Plan</span>
            </Button>
          </Link>
        </div>

        {/* Lista de planes con diseño iOS */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded-lg w-1/2 mb-6"></div>
                  <div className="h-3 bg-gray-200 rounded-lg w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="bg-red-50/80 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto border border-red-100">
              <h3 className="text-xl font-bold text-red-800 mb-3">Error al cargar planes</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-16 max-w-2xl mx-auto shadow-lg border border-white/50">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mb-8">
                <FileText className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No hay planes creados</h3>
              <p className="text-gray-600 mb-10 text-lg leading-relaxed">
                Comienza creando tu primer plan turístico con nuestra plantilla predefinida optimizada.
              </p>
              <Link href="/admin/dashboard/templates/tourism/create">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 py-4 text-lg font-semibold shadow-lg">
                  Crear Primer Plan
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan: Plan, index: number) => (
              <div key={plan.id} className="group">
                <Link href={`/admin/dashboard/templates/tourism/edit/${plan.id}`}>
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-white/50 cursor-pointer overflow-hidden">
                    {/* Efecto de fondo al hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative">
                      {/* Status badge */}
                      <div className="flex items-center justify-between mb-6">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          plan.published 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {plan.published ? 'Publicado' : 'Borrador'}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Eye className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      {/* Contenido */}
                      <h3 className="font-bold text-xl text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                        {plan.mainTitle}
                      </h3>
                      
                      <div className="flex items-center gap-3 text-gray-500 mb-6">
                        <MapPin className="h-5 w-5" />
                        <span className="font-medium">{plan.destination}</span>
                      </div>

                      <div className="flex items-center gap-3 text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{new Date(plan.createdAt).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
