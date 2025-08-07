export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  category: 'security' | 'analytics' | 'ui' | 'integration' | 'utility';
  enabled: boolean;
  author: string;
  icon: string;
  installDate?: string;
  configurable: boolean;
  dependencies?: string[];
  settings?: Record<string, any>;
}

// Configuración de plugins del sistema
export const AVAILABLE_PLUGINS: Plugin[] = [
  {
    id: 's3-storage',
    name: 'AWS S3 Storage',
    description: 'Almacena archivos y medios en Amazon S3 con configuración automática de CDN y optimización de costos',
    version: '2.1.0',
    category: 'integration',
    enabled: true,
    author: 'CMS Team',
    icon: '☁️',
    installDate: '2024-01-15',
    configurable: true,
    settings: {
      bucket: process.env.AWS_S3_BUCKET || '',
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      cdnEnabled: true
    }
  }
];

// Función para obtener plugins habilitados
export function getEnabledPlugins(): Plugin[] {
  return AVAILABLE_PLUGINS.filter(plugin => plugin.enabled);
}

// Función para obtener plugin por ID
export function getPluginById(id: string): Plugin | undefined {
  return AVAILABLE_PLUGINS.find(plugin => plugin.id === id);
}

// Función para obtener plugins por categoría
export function getPluginsByCategory(category: Plugin['category']): Plugin[] {
  return AVAILABLE_PLUGINS.filter(plugin => plugin.category === category);
}

// Función para verificar si un plugin está habilitado
export function isPluginEnabled(id: string): boolean {
  const plugin = getPluginById(id);
  return plugin?.enabled || false;
}