'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plugin } from '@/lib/plugins/config';

// Plugins disponibles en el sistema
const availablePlugins: Plugin[] = [
  {
    id: 's3',
    name: 'Amazon S3 Storage',
    description: 'Almacenamiento en la nube con Amazon S3. Sube y gestiona archivos de forma segura y escalable.',
    version: '1.0.0',
    category: 'utility',
    enabled: false,
    author: 'Nova CMS Team',
    icon: '☁️',
    configurable: true
  },
  {
    id: 'analytics',
    name: 'Google Analytics',
    description: 'Próximamente: Integración completa con Google Analytics para métricas avanzadas.',
    version: '1.0.0',
    category: 'analytics',
    enabled: false,
    author: 'Nova CMS Team',
    icon: '📊',
    configurable: false
  },
  {
    id: 'email',
    name: 'Email Marketing',
    description: 'Próximamente: Sistema de email marketing con plantillas y automatización.',
    version: '1.0.0',
    category: 'integration',
    enabled: false,
    author: 'Nova CMS Team',
    icon: '📧',
    configurable: false
  },
  {
    id: 'cdn',
    name: 'CDN Integration',
    description: 'Próximamente: Red de distribución de contenido para optimizar velocidad.',
    version: '1.0.0',
    category: 'utility',
    enabled: false,
    author: 'Nova CMS Team',
    icon: '🌐',
    configurable: false
  },
  {
    id: 'backup',
    name: 'Auto Backup',
    description: 'Próximamente: Respaldos automáticos programados y restauración.',
    version: '1.0.0',
    category: 'security',
    enabled: false,
    author: 'Nova CMS Team',
    icon: '💾',
    configurable: false
  },
  {
    id: 'seo',
    name: 'SEO Optimizer',
    description: 'Próximamente: Herramientas avanzadas de optimización SEO.',
    version: '1.0.0',
    category: 'utility',
    enabled: false,
    author: 'Nova CMS Team',
    icon: '🔍',
    configurable: false
  },
  {
    id: 'security',
    name: 'Security Shield',
    description: 'Próximamente: Protección avanzada contra amenazas y vulnerabilidades.',
    version: '1.0.0',
    category: 'security',
    enabled: false,
    author: 'Nova CMS Team',
    icon: '🛡️',
    configurable: false
  },
  {
    id: 'social',
    name: 'Social Media',
    description: 'Próximamente: Integración con redes sociales y publicación automática.',
    version: '1.0.0',
    category: 'integration',
    enabled: false,
    author: 'Nova CMS Team',
    icon: '📱',
    configurable: false
  }
];

export function usePlugins() {
  const [plugins, setPlugins] = useState<Plugin[]>(availablePlugins);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Cargar estados reales de plugins desde la API
  useEffect(() => {
    const loadPluginStates = async () => {
      setLoading(true);
      try {
        // Verificar el estado del plugin S3
        const s3Response = await fetch('/api/plugins/s3');
        const s3Data = await s3Response.json();
        
        setPlugins(prev => prev.map(plugin => {
          if (plugin.id === 's3') {
            return {
              ...plugin,
              enabled: s3Data.success && s3Data.config ? true : false,
              installDate: s3Data.success && s3Data.config ? new Date().toISOString().split('T')[0] : undefined
            };
          }
          return plugin;
        }));

        // Aquí se pueden agregar más verificaciones para otros plugins cuando estén disponibles
        // Por ejemplo: verificar Google Analytics, Email Service, etc.
        
      } catch (error) {
        console.error('Error loading plugin states:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPluginStates();
  }, []);

  // Filtrar plugins
  const filteredPlugins = useMemo(() => {
    return plugins.filter(plugin => {
      const matchesSearch = !searchTerm || 
        plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plugin.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plugin.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || plugin.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [plugins, searchTerm, categoryFilter]);

  // Toggle plugin status
  const togglePlugin = async (pluginId: string) => {
    const plugin = plugins.find(p => p.id === pluginId);
    if (!plugin) return;

    const newEnabledState = !plugin.enabled;

    // Actualizar estado local inmediatamente para mejor UX
    setPlugins(prev => prev.map(p => 
      p.id === pluginId 
        ? { 
            ...p, 
            enabled: newEnabledState,
            installDate: newEnabledState ? new Date().toISOString().split('T')[0] : undefined
          } 
        : p
    ));

    try {
      // Para el plugin S3, manejar la activación/desactivación
      if (pluginId === 's3') {
        if (!newEnabledState) {
          // Si se está desactivando, podrías hacer una llamada para limpiar la configuración
          // await fetch('/api/plugins/s3', { method: 'DELETE' });
        }
        // Si se está activando, el usuario necesitará configurarlo primero
      }

      // Para otros plugins, implementar lógica específica aquí
      
    } catch (error) {
      console.error(`Error toggling plugin ${pluginId}:`, error);
      
      // Revertir el cambio en caso de error
      setPlugins(prev => prev.map(p => 
        p.id === pluginId 
          ? { ...p, enabled: !newEnabledState }
          : p
      ));
    }
  };

  // Refresh plugins
  const refreshPlugins = async () => {
    setLoading(true);
    try {
      // Recargar estados de plugins
      const s3Response = await fetch('/api/plugins/s3');
      const s3Data = await s3Response.json();
      
      setPlugins(prev => prev.map(plugin => {
        if (plugin.id === 's3') {
          return {
            ...plugin,
            enabled: s3Data.success && s3Data.config ? true : false,
            installDate: s3Data.success && s3Data.config ? new Date().toISOString().split('T')[0] : undefined
          };
        }
        return plugin;
      }));
    } catch (error) {
      console.error('Error refreshing plugins:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    plugins,
    loading,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    filteredPlugins,
    togglePlugin,
    refreshPlugins
  };
}
