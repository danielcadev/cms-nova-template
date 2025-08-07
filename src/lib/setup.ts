// Setup principal de CMS Nova
import { NovaConfig } from '../types';
import { createNovaConfig, validateConfig } from './config';
import { auth } from './auth';

export function setupNova(config: Partial<NovaConfig>): {
  config: NovaConfig;
  auth: {
    handler: typeof auth;
    client: null;
  };
} {
  const fullConfig = createNovaConfig(config);
  
  if (!validateConfig(fullConfig)) {
    throw new Error('Configuración de CMS Nova inválida');
  }
  
  return {
    config: fullConfig,
    auth: {
      handler: auth,
      client: null // Se configurará según sea necesario
    }
  };
} 
