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
    icon: '☁️',
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
    icon: '🧭',
    configurable: true,
    settings: {
      // 'auto' uses /api/content-types to discover typePaths
      // 'include' uses a manual list in settings.include
      mode: 'auto', // 'auto' | 'include'
      include: [], // list of typePaths if mode = 'include'
      exclude: [], // typePaths to skip
      titleCase: true,
      // Controls tourism templates (normal routes), separate from headless typePath
      // Dynamic map: { [templateName: string]: boolean }
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
    icon: '🌐',
    configurable: false,
  },
  {
    id: 'analytics',
    name: 'Google Analytics',
    description: 'Coming soon: Full integration with Google Analytics for advanced metrics.',
    version: '1.0.0',
    category: 'analytics',
    enabled: false,
    author: 'CMS Team',
    icon: '📊',
    configurable: false,
  },
  {
    id: 'email',
    name: 'Email Marketing',
    description: 'Coming soon: Email marketing system with templates and automation.',
    version: '1.0.0',
    category: 'integration',
    enabled: false,
    author: 'CMS Team',
    icon: '📧',
    configurable: false,
  },
  {
    id: 'cdn',
    name: 'CDN Integration',
    description: 'Coming soon: Content Delivery Network to optimize speed.',
    version: '1.0.0',
    category: 'utility',
    enabled: false,
    author: 'CMS Team',
    icon: '🌐',
    configurable: false,
  },
  {
    id: 'backup',
    name: 'Auto Backup',
    description: 'Coming soon: Scheduled automatic backups and restoration.',
    version: '1.0.0',
    category: 'security',
    enabled: false,
    author: 'CMS Team',
    icon: '💾',
    configurable: false,
  },
  {
    id: 'seo',
    name: 'SEO Optimizer',
    description: 'Coming soon: Advanced SEO optimization tools.',
    version: '1.0.0',
    category: 'utility',
    enabled: false,
    author: 'CMS Team',
    icon: '🔍',
    configurable: false,
  },
  {
    id: 'security',
    name: 'Security Shield',
    description: 'Coming soon: Advanced protection against threats and vulnerabilities.',
    version: '1.0.0',
    category: 'security',
    enabled: false,
    author: 'CMS Team',
    icon: '🛡️',
    configurable: false,
  },
  {
    id: 'social',
    name: 'Social Media',
    description: 'Coming soon: Social media integration and automatic publishing.',
    version: '1.0.0',
    category: 'integration',
    enabled: false,
    author: 'CMS Team',
    icon: '📱',
    configurable: false,
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
