'use client';

import { 
  Shield, 
  BarChart3, 
  Palette, 
  Link, 
  Wrench, 
  MoreVertical, 
  Power, 
  Settings, 
  Trash2,
  Download,
  Star,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Sparkles,
  Crown,
  Zap
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { S3ConfigModal } from './S3ConfigModal';
import { useState } from 'react';
import { Plugin } from '@/lib/plugins/config';

interface PluginCardProps {
  plugin: Plugin;
  onToggle: (pluginId: string) => void;
}

const categoryConfig = {
  security: {
    icon: Shield,
    label: 'Seguridad',
    color: 'text-red-600 dark:text-red-400'
  },
  analytics: {
    icon: BarChart3,
    label: 'Analíticas',
    color: 'text-blue-600 dark:text-blue-400'
  },
  ui: {
    icon: Palette,
    label: 'Interfaz',
    color: 'text-purple-600 dark:text-purple-400'
  },
  integration: {
    icon: Link,
    label: 'Integración',
    color: 'text-emerald-600 dark:text-emerald-400'
  },
  utility: {
    icon: Wrench,
    label: 'Utilidades',
    color: 'text-amber-600 dark:text-amber-400'
  }
};

export function PluginCard({ plugin, onToggle }: PluginCardProps) {
  const [showS3Modal, setShowS3Modal] = useState(false);
  const config = categoryConfig[plugin.category];
  const CategoryIcon = config.icon;

  const handleConfigureClick = () => {
    if (plugin.id === 's3') {
      setShowS3Modal(true);
    }
  };

  const handleS3ConfigSave = async (s3Config: any) => {
    try {
      const response = await fetch('/api/plugins/s3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(s3Config),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la configuración');
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Error al guardar la configuración');
      }
    } catch (error) {
      console.error('Error saving S3 config:', error);
      throw error;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700 h-full">
      {/* Plugin Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <CategoryIcon className={`w-5 h-5 ${config.color}`} strokeWidth={1.5} />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 tracking-tight">
              {plugin.name}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{plugin.author}</span>
          </div>
        </div>
        
        <div className={`w-2 h-2 rounded-full ${
          plugin.enabled ? 'bg-emerald-500' : 'bg-gray-400'
        }`} />
      </div>

      {/* Plugin Description */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {plugin.description}
        </p>
      </div>

      {/* Plugin Details */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md font-medium">
            {config.label}
          </span>
          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md font-medium">
            v{plugin.version}
          </span>
        </div>
      </div>

      {/* Plugin Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Switch
            checked={plugin.enabled}
            onCheckedChange={() => onToggle(plugin.id)}
            disabled={!plugin.configurable}
            className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {plugin.enabled ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {plugin.configurable ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleConfigureClick}
              className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 text-sm font-medium"
            >
              <Settings className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Configurar
            </Button>
          ) : (
            <span className="text-xs px-3 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full font-medium">
              Próximamente
            </span>
          )}
        </div>
      </div>
      
      {/* S3 Configuration Modal */}
      {plugin.id === 's3' && (
        <S3ConfigModal
          plugin={plugin}
          isOpen={showS3Modal}
          onClose={() => setShowS3Modal(false)}
          onSave={handleS3ConfigSave}
        />
      )}
    </div>
  );
}
