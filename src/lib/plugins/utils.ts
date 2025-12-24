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
        let config = configs[id] ?? plugin?.settings ?? {}

        // Auto-decrypt sensitive values if encryption is configured
        const encryptionKey = process.env.ENCRYPTION_KEY || ''
        const isHex64 = /^[0-9a-fA-F]{64}$/.test(encryptionKey)

        if (isHex64 && config && typeof config === 'object') {
            const { decrypt } = await import('@/lib/encryption')
            const decryptedConfig = { ...config }
            for (const [k, v] of Object.entries(decryptedConfig)) {
                if (typeof v === 'string' && v.split(':').length === 3) {
                    decryptedConfig[k] = decrypt(v)
                }
            }
            config = decryptedConfig
        }

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
