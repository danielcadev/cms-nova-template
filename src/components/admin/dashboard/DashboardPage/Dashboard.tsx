'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Users,
  Activity,
  TrendingUp,
  Calendar,
  Settings,
  FileText,
  Database,
  Layout,
  BarChart3,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminService, UserStats } from '@/services/admin/user/adminService';
import { useToast } from '@/hooks/use-toast';
import { useCurrentUser } from '@/hooks/use-current-user';

export function Dashboard() {
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    growthRate: 0,
    activeUsers: 0,
    activeSessionsCount: 0,
    newUsersThisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, isLoading: userLoading } = useCurrentUser();

  // Cargar estadísticas
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const userStats = await adminService.getUserStats();
        setStats(userStats);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "No se pudieron cargar las estadísticas";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });

        setStats({
          total: 5,
          growthRate: 20,
          activeUsers: 3,
          activeSessionsCount: 2,
          newUsersThisMonth: 1
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [toast]);

  const userName = user?.name || 'Administrador';
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Buenos días' : currentHour < 18 ? 'Buenas tardes' : 'Buenas noches';

  // Loading state
  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900 dark:border-gray-700 dark:border-t-gray-100 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-center text-sm">Cargando dashboard...</p>
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
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-medium text-gray-900 dark:text-gray-100 mb-2 tracking-tight leading-tight">
                    {greeting}, {userName}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 font-light tracking-wide">Panel de administración</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/admin/dashboard/templates/tourism/create">
                  <Button className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700">
                    <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
                    Crear contenido
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards - Editorial Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Total Users */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                    {loading ? '...' : stats.total}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total usuarios</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-4 w-4 mr-1" strokeWidth={1.5} />
                  <span className="font-medium">+{loading ? '0' : stats.growthRate}%</span>
                </div>
                <span className="text-gray-400 dark:text-gray-500 ml-2">este mes</span>
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                    {loading ? '...' : stats.activeUsers}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Usuarios activos</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <div className="flex items-center text-blue-600 dark:text-blue-400">
                  <Activity className="h-4 w-4 mr-1" strokeWidth={1.5} />
                  <span className="font-medium">{loading ? '0' : stats.activeSessionsCount} sesiones</span>
                </div>
                <span className="text-gray-400 dark:text-gray-500 ml-2">activas</span>
              </div>
            </div>

            {/* New Users */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                    {loading ? '...' : stats.newUsersThisMonth}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Nuevos este mes</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <div className="flex items-center text-purple-600 dark:text-purple-400">
                  <TrendingUp className="h-4 w-4 mr-1" strokeWidth={1.5} />
                  <span className="font-medium">Crecimiento</span>
                </div>
                <span className="text-gray-400 dark:text-gray-500 ml-2">mensual</span>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                    100%
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Sistema</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2" />
                  <span className="font-medium">Operativo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid - Editorial Style */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Acciones rápidas</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Users Management */}
              <Link href="/admin/dashboard/users" className="group">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">Gestión de usuarios</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Administrar usuarios y permisos</p>
                </div>
              </Link>

              {/* Content Management */}
              <Link href="/admin/dashboard/view-content" className="group">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">Ver contenido</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Revisar y gestionar contenido</p>
                </div>
              </Link>

              {/* Templates */}
              <Link href="/admin/dashboard/templates" className="group">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <Layout className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">Plantillas</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Gestionar plantillas de contenido</p>
                </div>
              </Link>

              {/* Content Types */}
              <Link href="/admin/dashboard/content-types" className="group">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <Database className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">Tipos de contenido</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Configurar tipos de contenido</p>
                </div>
              </Link>

              {/* Plugins */}
              <Link href="/admin/dashboard/plugins" className="group">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <Plus className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">Plugins</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Gestionar extensiones y plugins</p>
                </div>
              </Link>

              {/* Settings */}
              <Link href="/admin/dashboard/settings" className="group">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">Configuración</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Ajustes del sistema</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
