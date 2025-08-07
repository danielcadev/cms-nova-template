// Configuración de CMS Nova
import { NovaConfig } from '../types';

export function createNovaConfig(config: Partial<NovaConfig>): NovaConfig {
  return {
    auth: {
      secret: '',
      adminRoles: ['ADMIN'],
      baseUrl: process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3000',
      requireEmailVerification: false,
      sessionDuration: 24 * 60 * 60 * 1000, // 24 horas
      ...config.auth
    },
    database: {
      url: process.env.DATABASE_URL || '',
      provider: 'postgresql',
      ...config.database
    },
    ui: {
      theme: 'light',
      title: 'CMS Nova',
      primaryColor: '#10b981',
      ...config.ui
    },
    features: {
      users: true,
      plans: true,
      analytics: false,
      fileManager: false,
      backup: false,
      ...config.features
    },
    permissions: config.permissions
  };
}

export function validateConfig(config: NovaConfig): boolean {
  if (!config.auth.secret) {
    console.error('❌ CMS Nova: AUTH_SECRET es requerido');
    return false;
  }
  
  if (!config.database.url) {
    console.error('❌ CMS Nova: DATABASE_URL es requerido');
    return false;
  }
  
  return true;
}

export const defaultConfig: NovaConfig = createNovaConfig({}); 
