type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'log'

const isProduction = process.env.NODE_ENV === 'production'
const REDACTED_KEYS = ['password', 'secret', 'token', 'authorization', 'cookie', 'email', 'apikey']

function sanitizeValue(value: unknown, seen = new WeakSet<object>()): unknown {
  if (value == null) return value

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: isProduction ? undefined : value.stack,
    }
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item, seen))
  }

  if (typeof value === 'object') {
    if (seen.has(value as object)) return '[Circular]'
    seen.add(value as object)

    const output: Record<string, unknown> = {}
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      const shouldRedact = REDACTED_KEYS.some((token) => key.toLowerCase().includes(token))
      output[key] = shouldRedact ? '[REDACTED]' : sanitizeValue(entry, seen)
    }
    return output
  }

  return value
}

function write(level: LogLevel, message: string, context?: unknown) {
  if (isProduction && level !== 'error' && level !== 'warn') return

  const payload = context === undefined ? [message] : [message, sanitizeValue(context)]

  switch (level) {
    case 'error':
      console.error(...payload)
      break
    case 'warn':
      console.warn(...payload)
      break
    case 'info':
      console.info(...payload)
      break
    case 'debug':
      console.debug(...payload)
      break
    default:
      console.log(...payload)
      break
  }
}

export const logger = {
  error(message: string, context?: unknown) {
    write('error', message, context)
  },
  warn(message: string, context?: unknown) {
    write('warn', message, context)
  },
  info(message: string, context?: unknown) {
    write('info', message, context)
  },
  debug(message: string, context?: unknown) {
    write('debug', message, context)
  },
  log(message: string, context?: unknown) {
    write('log', message, context)
  },
}

export default logger
