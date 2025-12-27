export interface Plugin {
  id: string
  name: string
  description: string
  version: string
  category: 'security' | 'analytics' | 'ui' | 'integration' | 'utility'
  enabled: boolean
  author: string
  icon: string
  installDate?: string
  configurable: boolean
  dependencies?: string[]
  settings?: Record<string, any>
}

// Configuración de plugins del sistema
export const AVAILABLE_PLUGINS: Plugin[] = [
  {
    id: 's3-storage',
    name: 'AWS S3 Storage',
    description:
      'Store files and media on Amazon S3 with automatic CDN configuration and cost optimization.',
    version: '2.1.0',
    category: 'integration',
    enabled: false,
    author: 'CMS Team',
    icon: 'Cloud',
    installDate: '2024-01-15',
    configurable: true,
    settings: {
      bucket: process.env.AWS_S3_BUCKET || '',
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      cdnEnabled: true,
    },
  },
  {
    id: 'dynamic-nav',
    name: 'Dynamic TypePath Nav',
    description: 'Adds navigation items based on content types (typePath).',
    version: '1.0.0',
    category: 'ui',
    enabled: false,
    author: 'CMS Team',
    icon: 'Compass',
    configurable: true,
    settings: {
      mode: 'auto',
      include: [],
      exclude: [],
      titleCase: true,
      templates: {},
    },
  },
  {
    id: 'public-typepaths',
    name: 'Public Type Paths',
    description:
      'Publicly exposes headless routes `/{typePath}` and `/{typePath}/{slug}` based on Content Types.',
    version: '1.0.0',
    category: 'utility',
    enabled: false,
    author: 'CMS Team',
    icon: 'Globe',
    configurable: false,
  },
  {
    id: 'google-gemini',
    name: 'AI Assistant',
    description:
      'Powerful AI generation for SEO, content assistance, and automatic field filling using Google Gemini or OpenRouter.',
    version: '1.1.0',
    category: 'integration',
    enabled: false,
    author: 'CMS Team',
    icon: 'Sparkles',
    configurable: true,
    settings: {
      provider: 'google',
      googleApiKey: process.env.GOOGLE_GEMINI_API_KEY || '',
      googleModel: 'gemini-1.5-flash',
      openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
      openRouterModel: 'google/gemini-2.0-flash-001',
    },
  },
]

// Función para obtener plugins habilitados
export function getEnabledPlugins(): Plugin[] {
  return AVAILABLE_PLUGINS.filter((plugin) => plugin.enabled)
}

// Función para obtener plugin por ID
export function getPluginById(id: string): Plugin | undefined {
  return AVAILABLE_PLUGINS.find((plugin) => plugin.id === id)
}

// Función para obtener plugins por categoría
export function getPluginsByCategory(category: Plugin['category']): Plugin[] {
  return AVAILABLE_PLUGINS.filter((plugin) => plugin.category === category)
}

// Función para verificar si un plugin está habilitado
export function isPluginEnabled(id: string): boolean {
  const plugin = getPluginById(id)
  return plugin?.enabled || false
}
