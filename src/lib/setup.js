import { createNovaConfig, validateConfig } from './config';
import { auth } from './auth';
export function setupNova(config) {
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
//# sourceMappingURL=setup.js.map