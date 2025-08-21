// Setup principal de CMS Nova
import type { NovaConfig } from '../types'
import { auth } from './auth'
import { createNovaConfig, validateConfig } from './config'

export function setupNova(config: Partial<NovaConfig>): {
  config: NovaConfig
  auth: {
    handler: typeof auth
    client: null
  }
} {
  const fullConfig = createNovaConfig(config)

  if (!validateConfig(fullConfig)) {
    throw new Error('Configuración de CMS Nova inválida')
  }

  return {
    config: fullConfig,
    auth: {
      handler: auth,
      client: null, // Se configurará según sea necesario
    },
  }
}
