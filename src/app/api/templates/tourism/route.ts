import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { NextResponse } from 'next/server'

// Detect templates by scanning src/app/* directories that match known tourism templates
// This is a simple filesystem-based heuristic for now.
export async function GET() {
  try {
    const appDir = `${process.cwd()}\\src\\app`

    // List directories inside src/app
    const entries = await readdir(appDir, { withFileTypes: true })

    // Consider a directory a "template" if it contains a page.tsx (index) or subroutes
    const templates: Array<{ name: string; path: string; hasIndex: boolean }> = []

    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      const name = entry.name
      if (name.startsWith('[')) continue // skip dynamic headless routes
      if (['admin', 'api'].includes(name)) continue // skip admin/api

      const dirPath = join(appDir, name)
      const _indexPath = join(dirPath, 'page.tsx')

      // Lazy check: rely on FS errors handled by try/catch per file
      let hasIndex = false
      try {
        // dynamic import not allowed here; check access by reading the directory entries
        const subEntries = await readdir(dirPath, { withFileTypes: true })
        hasIndex = subEntries.some((s) => s.isFile() && s.name === 'page.tsx')
      } catch {}

      templates.push({ name, path: `/${name}`, hasIndex })
    }

    // Return unique templates sorted by name
    const unique = templates.filter((t) => t.hasIndex).sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json({ templates: unique })
  } catch (error) {
    console.error('Error detecting tourism templates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
