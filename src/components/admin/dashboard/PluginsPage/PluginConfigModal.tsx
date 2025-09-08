'use client'

import { Eye, EyeOff, Save } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ModalBase, ModalBody, ModalFooter, ModalHeader } from '@/components/ui/Modal'
import { useToast } from '@/hooks/use-toast'
import type { Plugin } from '@/lib/plugins/config'
import { TemplatesSelector } from './TemplatesSelector'
import { TypePathsSelector } from './TypePathsSelector'

interface PluginConfigModalProps {
  plugin: Plugin | null
  isOpen: boolean
  onClose: () => void
  onSave: (config: Record<string, any>) => void
}

export function PluginConfigModal({ plugin, isOpen, onClose, onSave }: PluginConfigModalProps) {
  const id = useId()
  const { toast } = useToast()

  // Common saving state
  const [isSaving, setIsSaving] = useState(false)

  // S3 state
  const [s3Config, setS3Config] = useState({
    bucket: '',
    region: 'us-east-1',
    accessKeyId: '',
    secretAccessKey: '',
  })
  const [showSecrets, setShowSecrets] = useState(false)
  const [encryptionOk, setEncryptionOk] = useState<boolean | null>(null)
  const [_encryptionReason, setEncryptionReason] = useState<string>('')
  const [hasExistingConfig, setHasExistingConfig] = useState(false)
  // Cache encryption status for 30s to avoid repeated network calls when reopening modal
  const encCacheRef = useRef<{ ok: boolean; ts: number } | null>(null)

  // Dynamic Nav state
  const [navConfig, setNavConfig] = useState({
    mode: 'auto' as 'auto' | 'include',
    include: [] as string[],
    exclude: [] as string[],
    titleCase: true,
    templates: {} as Record<string, boolean>,
  })
  const [manualTypePath, setManualTypePath] = useState('')

  const pluginId = plugin?.id || ''
  const isS3 = pluginId === 's3' || pluginId === 's3-storage'
  const isDynamicNav = pluginId === 'dynamic-nav'

  useEffect(() => {
    if (!plugin) return

    if (isS3) {
      const bucket = plugin.settings?.bucket || ''
      const region = plugin.settings?.region || 'us-east-1'
      const accessKeyId = plugin.settings?.accessKeyId || ''
      const secretAccessKey = plugin.settings?.secretAccessKey || ''
      setS3Config({ bucket, region, accessKeyId, secretAccessKey })
      // Mark if there is an existing config (so secret can be optional when editing)
      setHasExistingConfig(!!(bucket && region && accessKeyId))
    }

    if (isDynamicNav) {
      setNavConfig({
        mode: (plugin.settings?.mode as 'auto' | 'include') || 'auto',
        include: Array.isArray(plugin.settings?.include) ? plugin.settings?.include : [],
        exclude: Array.isArray(plugin.settings?.exclude) ? plugin.settings?.exclude : [],
        titleCase: plugin.settings?.titleCase ?? true,
        templates: (plugin.settings?.templates as Record<string, boolean>) || {},
      })
    }
  }, [plugin, isS3, isDynamicNav])

  // Check if encryption is configured (for storing secrets)
  useEffect(() => {
    let ignore = false
    async function check() {
      if (!isS3) {
        setEncryptionOk(null)
        setEncryptionReason('')
        return
      }

      // Use short-lived cache (30s) to avoid repeated fetches
      const now = Date.now()
      const cached = encCacheRef.current
      if (cached && now - cached.ts < 30_000) {
        setEncryptionOk(cached.ok)
        if (!cached.ok) {
          toast({
            variant: 'destructive',
            title: 'Falta configurar ENCRYPTION_KEY',
            description:
              'Debes configurar ENCRYPTION_KEY (64 hex) para guardar la configuración de S3. Hasta entonces, el guardado está deshabilitado.',
          })
        }
        return
      }

      const ctrl = new AbortController()
      const timeout = setTimeout(() => ctrl.abort(), 2500)
      try {
        const res = await fetch('/api/system/encryption-status', {
          cache: 'no-store',
          signal: ctrl.signal,
        })
        const data = await res.json().catch(() => ({}))
        if (!ignore) {
          const ok = !!data.ok
          encCacheRef.current = { ok, ts: Date.now() }
          setEncryptionOk(ok)
          setEncryptionReason(data.reason || '')
          if (!ok) {
            toast({
              variant: 'destructive',
              title: 'Falta configurar ENCRYPTION_KEY',
              description:
                'Debes configurar ENCRYPTION_KEY (64 hex) para guardar la configuración de S3. Hasta entonces, el guardado está deshabilitado.',
            })
          }
        }
      } catch {
        if (!ignore) {
          encCacheRef.current = { ok: false, ts: Date.now() }
          setEncryptionOk(false)
          setEncryptionReason('error')
          toast({
            variant: 'destructive',
            title: 'No se pudo verificar ENCRYPTION_KEY',
            description: 'Intenta recargar la página o revisa el servidor.',
          })
        }
      } finally {
        clearTimeout(timeout)
      }
    }
    check()
    return () => {
      ignore = true
    }
  }, [isS3, toast])

  const title = useMemo(() => {
    if (isS3) return 'Configure AWS S3 Storage'
    if (isDynamicNav) return 'Dynamic TypePath Nav'
    return plugin?.name || 'Configure Plugin'
  }, [isS3, isDynamicNav, plugin])

  const subtitle = useMemo(() => {
    if (isS3) return 'Set up your S3 bucket for file storage'
    if (isDynamicNav)
      return 'Configure how public menu items are generated and optional template routes.'
    return plugin?.description || ''
  }, [isS3, isDynamicNav, plugin])

  const handleSave = async () => {
    if (!plugin) return
    setIsSaving(true)
    try {
      if (isS3) {
        // Avoid sending placeholder/masked secret when the user didn't change it
        const payload = { ...s3Config }
        if (!payload.secretAccessKey || payload.secretAccessKey.trim().startsWith('•')) {
          delete (payload as any).secretAccessKey
        }
        await onSave(payload)
      } else if (isDynamicNav) {
        await onSave(navConfig)
      } else {
        await onSave(plugin.settings || {})
      }
      onClose()
    } catch (e) {
      console.error('Error saving plugin config:', e)
    } finally {
      setIsSaving(false)
    }
  }

  if (!plugin || !isOpen) return null

  return (
    <ModalBase isOpen={isOpen} onClose={onClose}>
      <ModalHeader
        onClose={onClose}
        icon={<div>{plugin.icon}</div>}
        title={title}
        subtitle={subtitle}
      />

      <ModalBody>
        {/* S3 STORAGE CONFIG */}
        {isS3 && (
          <div className="space-y-8">
            {/* Bucket Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium theme-text">Bucket configuration</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${id}-bucket`} className="text-sm font-medium theme-text">
                    Bucket name
                  </Label>
                  <Input
                    id={`${id}-bucket`}
                    value={s3Config.bucket}
                    onChange={(e) => setS3Config((prev) => ({ ...prev, bucket: e.target.value }))}
                    placeholder="my-s3-bucket"
                    className="rounded-lg theme-border theme-card theme-text placeholder:theme-text-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-region`} className="text-sm font-medium theme-text">
                    Region
                  </Label>
                  <select
                    id={`${id}-region`}
                    value={s3Config.region}
                    onChange={(e) => setS3Config((prev) => ({ ...prev, region: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border theme-border theme-card theme-text"
                  >
                    <option value="us-east-1">US East (N. Virginia)</option>
                    <option value="us-west-2">US West (Oregon)</option>
                    <option value="eu-west-1">Europe (Ireland)</option>
                    <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                    <option value="sa-east-1">South America (São Paulo)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Credentials */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium theme-text">AWS credentials</h3>
                <button
                  type="button"
                  onClick={() => setShowSecrets(!showSecrets)}
                  className="flex items-center gap-2 text-sm theme-text-secondary hover:theme-text"
                >
                  {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showSecrets ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* Encryption warning */}
              {isS3 && encryptionOk === false && (
                <div className="rounded-lg border border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-3 text-red-900 dark:text-red-100 text-sm">
                  <p className="font-medium mb-1">Encryption key required</p>
                  <p className="text-xs opacity-90">
                    Set ENCRYPTION_KEY (64 hexadecimal characters) in your environment before saving
                    this configuration. Saving is disabled to prevent inconsistent state.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`${id}-accessKeyId`} className="text-sm font-medium theme-text">
                    Access Key ID
                  </Label>
                  <Input
                    id={`${id}-accessKeyId`}
                    type={showSecrets ? 'text' : 'password'}
                    value={s3Config.accessKeyId}
                    onChange={(e) =>
                      setS3Config((prev) => ({ ...prev, accessKeyId: e.target.value }))
                    }
                    placeholder="AKIA..."
                    className="rounded-lg theme-border theme-card theme-text placeholder:theme-text-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`${id}-secretAccessKey`}
                    className="text-sm font-medium theme-text"
                  >
                    Secret Access Key
                  </Label>
                  <Input
                    id={`${id}-secretAccessKey`}
                    type={showSecrets ? 'text' : 'password'}
                    value={s3Config.secretAccessKey}
                    onChange={(e) =>
                      setS3Config((prev) => ({ ...prev, secretAccessKey: e.target.value }))
                    }
                    placeholder="••••••••••••••••••••••••••••••••••••••••"
                    disabled={encryptionOk === false}
                    className="rounded-lg theme-border theme-card theme-text placeholder:theme-text-muted"
                  />
                  {encryptionOk === false && (
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                      This field is disabled until ENCRYPTION_KEY is set.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* S3 Policy */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-3">
                🔒 Required S3 policy
              </h4>
              <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                Add this policy to your S3 bucket to allow public read access to images:
              </p>
              <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                <pre className="text-xs text-green-400 whitespace-pre-wrap">{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${s3Config.bucket || 'YOUR-BUCKET'}/*"
    }
  ]
}`}</pre>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                Replace "YOUR-BUCKET" with your bucket name if not filled above.
              </p>
            </div>

            {/* CORS for presigned uploads */}
            <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-sky-900 dark:text-sky-100 mb-3">
                🌐 CORS configuration (required for direct browser uploads)
              </h4>
              <ol className="list-decimal pl-5 text-sm text-sky-800 dark:text-sky-200 space-y-1 mb-3">
                <li>Go to AWS Console → S3 → Your bucket → Permissions → CORS → Edit</li>
                <li>Paste the following JSON and save</li>
                <li>Include your production domain and localhost for development</li>
              </ol>
              <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                <pre className="text-xs text-blue-300 whitespace-pre-wrap">{`[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://your-domain.com"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]`}</pre>
              </div>
              <p className="text-xs text-sky-700 dark:text-sky-300 mt-2">
                Update the origin array with your real domain. Without this, presigned uploads will
                fallback to server uploads.
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                💡 Important information
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Ensure the bucket has the correct permissions</li>
                <li>• Credentials are stored securely</li>
                <li>• The policy grants public read-only access</li>
                <li>• Files are accessed directly from S3</li>
              </ul>
            </div>
          </div>
        )}

        {/* DYNAMIC NAV CONFIG */}
        {isDynamicNav && (
          <div className="space-y-6">
            {/* Enable switch */}
            <div className="space-y-2">
              <Label className="text-sm font-medium theme-text">Status</Label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={plugin.enabled}
                  onChange={() => {
                    const event = new CustomEvent('nova-toggle-plugin', {
                      detail: { id: plugin.id },
                    })
                    window.dispatchEvent(event)
                  }}
                />
                {plugin.enabled ? 'Enabled' : 'Disabled'}
              </label>
            </div>

            {/* Mode */}
            <div className="space-y-2">
              <Label className="text-sm font-medium theme-text">Mode</Label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={`${id}-mode`}
                    value="auto"
                    checked={navConfig.mode === 'auto'}
                    onChange={() => setNavConfig((p) => ({ ...p, mode: 'auto' }))}
                  />
                  Auto (read from /api/content-types)
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={`${id}-mode`}
                    value="include"
                    checked={navConfig.mode === 'include'}
                    onChange={() => setNavConfig((p) => ({ ...p, mode: 'include' }))}
                  />
                  Manual (include list)
                </label>
              </div>
            </div>

            {/* Include (Headless CMS typePaths) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium theme-text">TypePaths (Headless CMS)</Label>
              <TypePathsSelector
                mode={navConfig.mode}
                include={navConfig.include}
                setInclude={(list) => setNavConfig((p) => ({ ...p, include: list }))}
              />
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Add manually (e.g. blog)"
                  value={manualTypePath}
                  onChange={(e) => setManualTypePath(e.target.value)}
                  className="rounded-lg theme-border theme-card theme-text placeholder:theme-text-muted"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const v = manualTypePath.trim()
                    if (!v) return
                    setNavConfig((p) => ({
                      ...p,
                      include: Array.from(new Set([...(p.include || []), v])),
                    }))
                    setManualTypePath('')
                  }}
                >
                  Add
                </Button>
              </div>
              <p className="text-xs theme-text-muted">
                Used when mode is Manual. Discovers your Content Types and lets you activate via
                switch (e.g. blog). You can also add them manually.
              </p>
            </div>

            {/* Templates (Tourism) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium theme-text">Templates (Tourism)</Label>
              <TemplatesSelector config={navConfig} setConfig={setNavConfig} />
              <p className="text-xs theme-text-muted">
                These options control normal routes (e.g. /planes, /circuitos, /restaurantes), not
                the headless typePaths.
              </p>
            </div>

            {/* Exclude */}
            <div className="space-y-2">
              <Label htmlFor={`${id}-exclude`} className="text-sm font-medium theme-text">
                Exclude (comma-separated)
              </Label>
              <Input
                id={`${id}-exclude`}
                value={navConfig.exclude.join(', ')}
                onChange={(e) =>
                  setNavConfig((p) => ({
                    ...p,
                    exclude: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="planes"
                className="rounded-lg theme-border theme-card theme-text placeholder:theme-text-muted"
              />
            </div>

            {/* Title case */}
            <div className="space-y-2">
              <Label className="text-sm font-medium theme-text">Label formatting</Label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={navConfig.titleCase}
                  onChange={(e) => setNavConfig((p) => ({ ...p, titleCase: e.target.checked }))}
                />
                Title Case (Blog, News)
              </label>
            </div>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" onClick={onClose} className="theme-border">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={
            isSaving ||
            (isS3 &&
              (!s3Config.bucket ||
                !s3Config.accessKeyId ||
                (!hasExistingConfig && !s3Config.secretAccessKey))) ||
            (isS3 && encryptionOk === false)
          }
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Save className="h-4 w-4 mr-2" strokeWidth={1.5} />
          {isSaving ? 'Saving...' : 'Save configuration'}
        </Button>
      </ModalFooter>
    </ModalBase>
  )
}
