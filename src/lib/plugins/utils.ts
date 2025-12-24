import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { AVAILABLE_PLUGINS, type Plugin } from './config'

const STORE_PATH = join(process.cwd(), 'src', 'lib', 'plugins', 'store.json')

export async function getPluginSettings(id: string): Promise<{
    enabled: boolean
    config: Record<string, any>
    plugin: Plugin | undefined
}> {
    const plugin = AVAILABLE_PLUGINS.find((p) => p.id === id)

    try {
        const buf = await readFile(STORE_PATH, 'utf-8')
        const raw = JSON.parse(buf)

        // Read from store.json
        const configs = raw?.configs || {}
        const states = raw?.states || {}

        const enabled = states[id] ?? plugin?.enabled ?? false
        const config = configs[id] ?? plugin?.settings ?? {}

        return { enabled, config, plugin }
    } catch {
        // If store doesn't exist, use defaults
        return {
            enabled: plugin?.enabled || false,
            config: plugin?.settings || {},
            plugin,
        }
    }
}
