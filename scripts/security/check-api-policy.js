import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import process from 'node:process'
import { isPublicApiRoute } from '../../src/server/policy/api-visibility.js'

const GUARD_MARKERS = [
  'getAdminSession(',
  'isRequestAdmin(',
  'getRequestSession(',
]

const REEXPORT_FROM_RE = /export\s+(?:\*|\{[^}]*\})\s+from\s+['"]([^'"]+)['"]/g

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) {
      walk(full, out)
    } else if (name === 'route.ts') {
      out.push(full)
    }
  }
  return out
}

function toRoutePath(filePath) {
  // filePath: <repo>/src/app/api/<segments>/route.ts
  const apiRoot = join(process.cwd(), 'src', 'app', 'api')
  const rel = relative(apiRoot, filePath)
  const parts = rel.split(sep).filter(Boolean)
  // drop trailing route.ts
  parts.pop()

  const normalized = parts
    .map((p) => {
      if (p.startsWith('[...') && p.endsWith(']')) return '*'
      if (p.startsWith('[') && p.endsWith(']')) return `:${p.slice(1, -1)}`
      return p
    })
    .join('/')

  return `/api/${normalized}`.replace(/\/$/, '')
}

function analyzeRoute(filePath) {
  const routePath = toRoutePath(filePath)
  const raw = readFileSync(filePath, 'utf-8')
  const hasGuard = hasGuardInFileOrReexports(filePath, raw)
  const isPublic = isPublicApiRoute(routePath)
  return { filePath, routePath, isPublic, hasGuard }
}

function hasGuardInText(raw) {
  return GUARD_MARKERS.some((m) => raw.includes(m))
}

function extractReexportSpecifiers(raw) {
  const specifiers = []
  REEXPORT_FROM_RE.lastIndex = 0
  for (;;) {
    const match = REEXPORT_FROM_RE.exec(raw)
    if (!match) break
    if (match[1]) specifiers.push(match[1])
  }
  return specifiers
}

function resolveModule(fromFile, specifier) {
  const base = (() => {
    if (specifier.startsWith('@/')) return join(process.cwd(), 'src', specifier.slice(2))
    if (specifier.startsWith('./') || specifier.startsWith('../')) {
      return resolve(dirname(fromFile), specifier)
    }
    if (specifier.startsWith('src/')) return join(process.cwd(), specifier)
    return null
  })()

  if (!base) return null

  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.jsx`,
    join(base, 'index.ts'),
    join(base, 'index.tsx'),
    join(base, 'index.js'),
    join(base, 'index.jsx'),
  ]

  for (const c of candidates) {
    if (existsSync(c) && statSync(c).isFile()) return c
  }

  return null
}

function hasGuardInFileOrReexports(filePath, raw) {
  const visited = new Set()
  return scan(filePath, raw)

  function scan(currentPath, preloadedRaw) {
    if (visited.has(currentPath)) return false
    visited.add(currentPath)

    const text = preloadedRaw ?? readFileSync(currentPath, 'utf-8')
    if (hasGuardInText(text)) return true

    const specifiers = extractReexportSpecifiers(text)
    for (const spec of specifiers) {
      const nextPath = resolveModule(currentPath, spec)
      if (!nextPath) continue
      if (scan(nextPath)) return true
    }

    return false
  }
}

function main() {
  const apiRoot = join(process.cwd(), 'src', 'app', 'api')
  const files = walk(apiRoot)
  const infos = files.map(analyzeRoute).sort((a, b) => a.routePath.localeCompare(b.routePath))

  const violations = infos.filter((r) => !r.isPublic && !r.hasGuard)
  if (violations.length) {
    // eslint-disable-next-line no-console
    console.error('\nAPI policy violations (non-public route missing auth guard):')
    for (const v of violations) {
      // eslint-disable-next-line no-console
      console.error(`- ${v.routePath} (${relative(process.cwd(), v.filePath)})`)
    }
    // eslint-disable-next-line no-console
    console.error(
      '\nPolicy: all /api routes are private unless explicitly allowlisted in src/server/policy/api-visibility.js',
    )
    process.exit(1)
  }

  // eslint-disable-next-line no-console
  console.log(`OK: ${infos.length} API routes scanned, ${violations.length} violations.`)
}

main()
