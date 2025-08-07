/**
 * Sistema de logging centralizado que puede desactivarse en producción
 */

// Determinar si estamos en producción
const isProduction = process.env.NODE_ENV === 'production';

// Logger que no hace nada en producción
export const logger = {
  log: isProduction ? () => {} : console.log,
  error: isProduction ? () => {} : console.error,
  warn: isProduction ? () => {} : console.warn,
  info: isProduction ? () => {} : console.info,
  debug: isProduction ? () => {} : console.debug,
};

// Para usar en lugar de console.log
export default logger; 
