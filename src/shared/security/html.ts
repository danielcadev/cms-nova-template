const BLOCKED_TAGS = [
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'link',
  'meta',
  'base',
  'form',
]

export function sanitizeHtmlContent(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) return ''

  let sanitized = value

  for (const tag of BLOCKED_TAGS) {
    const pairedTag = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi')
    const selfClosingTag = new RegExp(`<${tag}\\b[^>]*\\/?\\s*>`, 'gi')
    sanitized = sanitized.replace(pairedTag, '')
    sanitized = sanitized.replace(selfClosingTag, '')
  }

  sanitized = sanitized.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  sanitized = sanitized.replace(/\sstyle\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  sanitized = sanitized.replace(
    /(href|src)\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*'|javascript:[^\s>]*)/gi,
    '$1="#"',
  )

  return sanitized
}
