import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/server-session'

const APP_DIR = path.join(process.cwd(), 'src', 'app')

function getDynamicRoutes(dir: string, baseRoute = ''): string[] {
    const results: string[] = []
    if (!fs.existsSync(dir)) return results

    const items = fs.readdirSync(dir, { withFileTypes: true })

    for (const item of items) {
        if (item.isDirectory()) {
            const fullPath = path.join(dir, item.name)
            const currentRoute = baseRoute ? `${baseRoute}/${item.name}` : item.name

            // Skip internal folders and admin/api
            if (
                item.name.startsWith('_') ||
                item.name.startsWith('(') ||
                item.name === 'api' ||
                item.name === 'admin'
            ) {
                // Continue scanning inside but don't record the route if it's special
                // Except for (groups), we scan inside but keep the same baseRoute
                const nextBase = (item.name.startsWith('(') || item.name.startsWith('_')) ? baseRoute : currentRoute
                results.push(...getDynamicRoutes(fullPath, nextBase))
                continue
            }

            // If this directory is [slug] or similar, include it as a valid entry route
            if (item.name.startsWith('[') && item.name.endsWith(']')) {
                results.push(currentRoute)
            }

            results.push(...getDynamicRoutes(fullPath, currentRoute))
        }
    }

    return results
}

export async function GET() {
    const session = await getAdminSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const routesFound = Array.from(new Set(getDynamicRoutes(APP_DIR)))
            .filter((r) => r !== 'api' && !r.startsWith('admin'))
            .sort()

        // Map to labels for the UI
        const routes = routesFound.map((r) => ({
            value: r,
            label: r === '/' ? 'Root (Default)' : r.replace(/\[/g, '').replace(/\]/g, '').replace(/\//g, ' > '),
        }))

        return NextResponse.json({ success: true, routes })
    } catch (error) {
        console.error('Error discovering routes:', error)
        return NextResponse.json({ success: false, error: 'Failed to discover routes' }, { status: 500 })
    }
}
