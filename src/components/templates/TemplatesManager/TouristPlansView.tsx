'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Eye,
  Plus,
  FileText,
  Search,
  Trash2,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

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
  onDeletePlan?: (planId: string) => Promise<void>;
}

export function TouristPlansView({ plans, isLoading, error, onBack, onDeletePlan }: TouristPlansViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);
  const { toast } = useToast();

  // Debug log
  console.log('TouristPlansView props:', {
    plansCount: plans.length,
    hasDeleteFunction: !!onDeletePlan,
    firstPlan: plans[0]
  });

  // Filtrar planes basado en la búsqueda
  const filteredPlans = plans.filter(plan =>
    plan.mainTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (plan.destination && plan.destination.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeletePlan = async (planId: string, planTitle: string) => {
    if (!onDeletePlan) return;

    if (confirm(`¿Estás seguro de que quieres eliminar "${planTitle}"? Esta acción no se puede deshacer.`)) {
      setDeletingPlanId(planId);
      try {
        await onDeletePlan(planId);
        toast({
          title: "Plan eliminado",
          description: `"${planTitle}" ha sido eliminado exitosamente.`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error al eliminar",
          description: "No se pudo eliminar el plan. Inténtalo de nuevo.",
        });
      } finally {
        setDeletingPlanId(null);
      }
    }
  };
  // Estadísticas
  const stats = {
    total: plans.length,
    published: plans.filter(p => p.published).length,
    draft: plans.filter(p => !p.published).length,
    recent: plans.filter(p => {
      const planDate = new Date(p.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return planDate >= weekAgo;
    }).length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 relative">
      {/* Clean editorial background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-gray-950 dark:to-gray-900/50" />

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Editorial header */}
          <div className="mb-16">
            <div className="flex items-start justify-between mb-12">
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  onClick={onBack}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                  <span className="font-medium">Volver</span>
                </Button>

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

                <div className="space-y-2">
                  <h1 className="text-4xl lg:text-5xl font-medium text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
                    Planes Turísticos
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 font-light tracking-wide">
                    Gestiona tus itinerarios de viaje predefinidos
                  </p>
                </div>
              </div>

              <Link href="/admin/dashboard/templates/tourism/create">
                <Button className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                  <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
                  Crear Nuevo Plan
                </Button>
              </Link>
            </div>
          </div>

          {/* Editorial Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div className="text-right">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{stats.total}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total planes</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2" />
                <div className="text-right">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{stats.published}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Publicados</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
                <div className="text-right">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{stats.draft}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Borradores</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                <div className="text-right">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{stats.recent}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Esta semana</div>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de búsqueda */}
          {plans.length > 0 && (
            <div className="mb-8">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" strokeWidth={1.5} />
                <Input
                  type="text"
                  placeholder="Buscar planes por título o destino..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-lg border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-gray-400 dark:focus:ring-gray-500"
                />
              </div>
              {searchTerm && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Mostrando {filteredPlans.length} de {plans.length} planes
                </p>
              )}
            </div>
          )}

          {/* Lista de planes */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 px-4">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-6">
                  <FileText className="w-8 h-8 text-red-600 dark:text-red-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">Error al cargar planes</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{error}</p>
              </div>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                  <FileText className="w-8 h-8 text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
                  No hay planes creados
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  Comienza creando tu primer plan turístico con nuestra plantilla predefinida optimizada.
                </p>
                <Link href="/admin/dashboard/templates/tourism/create">
                  <Button className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
                    Crear Primer Plan
                  </Button>
                </Link>
              </div>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
                  No se encontraron planes
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  No hay planes que coincidan con "{searchTerm}"
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm('')}
                  className="border-gray-300 dark:border-gray-700"
                >
                  Limpiar búsqueda
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map((plan: Plan) => (
                <Link key={plan.id} href={`/admin/dashboard/templates/tourism/edit/${plan.id}`}>
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700 cursor-pointer group">
                    {/* Header con status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            Plan Turístico
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${plan.published
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                          }`}>
                          {plan.published ? 'Publicado' : 'Borrador'}
                        </span>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/dashboard/templates/tourism/edit/${plan.id}`} className="flex items-center gap-3 cursor-pointer font-medium">
                                <Eye className="h-4 w-4 text-blue-600" strokeWidth={1.5} />
                                Editar plan
                              </Link>
                            </DropdownMenuItem>
                            {onDeletePlan && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDeletePlan(plan.id, plan.mainTitle);
                                }}
                                disabled={deletingPlanId === plan.id}
                                className="flex items-center gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer font-medium"
                              >
                                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                                {deletingPlanId === plan.id ? 'Eliminando...' : 'Eliminar plan'}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Título del plan */}
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {plan.mainTitle || 'Plan sin título'}
                    </h3>

                    {/* Información del destino */}
                    {plan.destination && (
                      <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {plan.destination}
                        </span>
                      </div>
                    )}

                    {/* Footer con fecha */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4" strokeWidth={1.5} />
                        <span>
                          {new Date(plan.createdAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
