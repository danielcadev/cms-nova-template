'use client';

import { 
  Plus, 
  Settings,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PluginsHeaderProps {
  onRefresh: () => void;
  enabledCount: number;
  totalCount: number;
}

export function PluginsHeader({
  onRefresh,
  enabledCount,
  totalCount
}: PluginsHeaderProps) {
  return (
    <div className="space-y-8">
      {/* Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Plugins</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Administra las extensiones de tu CMS</p>
        </div>

        <div className="flex gap-3 items-center">
          <Button
            variant="outline"
            onClick={onRefresh}
            className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 font-medium"
          >
            <RefreshCw className="h-4 w-4 mr-2" strokeWidth={1.5} />
            Actualizar
          </Button>

          <Button className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 transition-all duration-200 font-medium">
            <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
            Instalar Plugin
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-emerald-600 rounded-full" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Plugins Activos</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{enabledCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Instalados</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{totalCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En Desarrollo</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{totalCount - 1}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
