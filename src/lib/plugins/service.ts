import { AVAILABLE_PLUGINS, Plugin } from './config';

// Simulamos un almacenamiento local para el estado de los plugins
// En una aplicación real, esto podría estar en una base de datos o archivo de configuración
let pluginStates: Record<string, boolean> = {};

// Inicializar estados desde la configuración
AVAILABLE_PLUGINS.forEach(plugin => {
  pluginStates[plugin.id] = plugin.enabled;
});

export class PluginService {
  // Obtener todos los plugins con su estado actual
  static async getAllPlugins(): Promise<Plugin[]> {
    const plugins = await Promise.all(
      AVAILABLE_PLUGINS.map(async (plugin) => {
        let settings = plugin.settings;
        
        // Para S3, cargar configuración desde la base de datos
        if (plugin.id === 's3-storage' || plugin.id === 's3') {
          try {
            const response = await fetch('/api/plugins/s3');
            if (response.ok) {
              const data = await response.json();
              if (data.success && data.config) {
                settings = data.config;
              }
            }
          } catch (error) {
            console.error('Error loading S3 config:', error);
          }
        }
        
        return {
          ...plugin,
          enabled: pluginStates[plugin.id] ?? plugin.enabled,
          settings
        };
      })
    );
    
    return plugins;
  }

  // Alternar el estado de un plugin
  static async togglePlugin(pluginId: string): Promise<boolean> {
    const plugin = AVAILABLE_PLUGINS.find(p => p.id === pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    // Verificar dependencias antes de desactivar
    if (pluginStates[pluginId] && plugin.dependencies) {
      const dependentPlugins = AVAILABLE_PLUGINS.filter(p => 
        p.dependencies?.includes(pluginId) && pluginStates[p.id]
      );
      
      if (dependentPlugins.length > 0) {
        throw new Error(
          `Cannot disable ${plugin.name}. The following plugins depend on it: ${
            dependentPlugins.map(p => p.name).join(', ')
          }`
        );
      }
    }

    pluginStates[pluginId] = !pluginStates[pluginId];
    
    // En una aplicación real, aquí guardarías el estado en la base de datos
    // await savePluginState(pluginId, pluginStates[pluginId]);
    
    return pluginStates[pluginId];
  }

  // Obtener estadísticas de plugins
  static async getPluginStats() {
    const plugins = await this.getAllPlugins();
    const enabled = plugins.filter(p => p.enabled).length;
    const total = plugins.length;
    
    return {
      total,
      enabled,
      disabled: total - enabled,
      byCategory: {
        security: plugins.filter(p => p.category === 'security').length,
        analytics: plugins.filter(p => p.category === 'analytics').length,
        ui: plugins.filter(p => p.category === 'ui').length,
        integration: plugins.filter(p => p.category === 'integration').length,
        utility: plugins.filter(p => p.category === 'utility').length,
      }
    };
  }

  // Verificar si un plugin está habilitado
  static isEnabled(pluginId: string): boolean {
    return pluginStates[pluginId] ?? false;
  }

  // Obtener configuración de un plugin
  static getPluginConfig(pluginId: string): Record<string, any> | undefined {
    const plugin = AVAILABLE_PLUGINS.find(p => p.id === pluginId);
    return plugin?.settings;
  }

  // Actualizar configuración de un plugin
  static async updatePluginConfig(pluginId: string, config: Record<string, any>): Promise<void> {
    const plugin = AVAILABLE_PLUGINS.find(p => p.id === pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    if (!plugin.configurable) {
      throw new Error(`Plugin ${plugin.name} is not configurable`);
    }

    // En una aplicación real, aquí guardarías la configuración en la base de datos
    plugin.settings = { ...plugin.settings, ...config };
  }
}