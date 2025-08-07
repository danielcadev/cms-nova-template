import { NovaConfig } from '../types';

/**
 * NOVA CMS DEFAULT CONFIGURATION
 * ==============================
 * Comprehensive default configuration for Nova CMS
 * Covers authentication, database, UI theming, and feature flags
 */

export const defaultConfig: NovaConfig = {
  auth: {
    secret: process.env.NOVA_AUTH_SECRET || 'your-secret-key-change-in-production',
    adminRoles: ['admin', 'super_admin'],
    sessionDuration: 24 * 60 * 60, // 24 horas en segundos
    requireEmailVerification: false,
    allowRegistration: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60, // 15 minutos en segundos
  },
  database: {
    url: process.env.DATABASE_URL || '',
    provider: 'postgresql',
    connectionPoolSize: 10,
    queryTimeout: 30000, // 30 segundos
    enableLogging: process.env.NODE_ENV === 'development',
  },
  ui: {
    theme: 'light',
    title: 'Nova CMS',
    description: 'Sistema de gestión de contenido modular',
    favicon: '/favicon.ico',
    logo: '/logo.png',
    primaryColor: '#3b82f6', // blue-500
    accentColor: '#10b981', // emerald-500
    errorColor: '#ef4444', // red-500
    warningColor: '#f59e0b', // amber-500
    successColor: '#10b981', // emerald-500
    fontFamily: 'Inter, system-ui, sans-serif',
    borderRadius: '0.75rem', // rounded-xl
  },
  features: {
    users: true,
    plans: true,
    contentTypes: true,
    headlessCMS: true,
    templateSystem: true,
    fileUpload: true,
    imageOptimization: true,
    analytics: false,
    backup: false,
    multiLanguage: false,
    seo: true,
    cache: true,
    search: true,
  },
  performance: {
    enableCache: true,
    cacheStrategy: 'memory', // 'memory' | 'redis' | 'database'
    cacheTTL: 60 * 60, // 1 hora en segundos
    enableImageOptimization: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    enableGzip: true,
  },
  security: {
    enableCSRF: true,
    enableCORS: true,
    allowedOrigins: ['http://localhost:3000'],
    enableRateLimiting: true,
    rateLimitWindow: 15 * 60 * 1000, // 15 minutos
    rateLimitMaxRequests: 100,
    enableFileUploadSecurity: true,
    maxRequestSize: '1mb',
  },
  notifications: {
    enableEmail: false,
    emailProvider: 'nodemailer',
    enablePush: false,
    enableInApp: true,
  },
  seo: {
    enableSitemap: true,
    enableRobots: true,
    defaultMetaTitle: 'Nova CMS',
    defaultMetaDescription: 'Sistema de gestión de contenido modular y profesional',
    enableOpenGraph: true,
    enableTwitterCards: true,
  }
}; 
