'use client'

import { Eye, EyeOff, Save } from 'lucide-react'
import { useEffect, useId, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ModalBase, ModalBody, ModalFooter, ModalHeader } from '@/components/ui/Modal'
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

  // Common saving state
  const [isSaving, setIsSaving] = useState(false)

  // S3 state
  const [s3Config, setS3Config] = useState({
    bucket: '',
    region: 'us-east-1',
    accessKeyId: '',
    secretAccessKey: '',
  })
  const [showSecrets, setShowSecrets] = useState(true)

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
      setS3Config({
        bucket: plugin.settings?.bucket || '',
        region: plugin.settings?.region || 'us-east-1',
        accessKeyId: plugin.settings?.accessKeyId || '',
        secretAccessKey: plugin.settings?.secretAccessKey || '',
      })
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
        await onSave(s3Config)
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
                    className="rounded-lg theme-border theme-card theme-text placeholder:theme-text-muted"
                  />
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
            (isS3 && (!s3Config.bucket || !s3Config.accessKeyId || !s3Config.secretAccessKey))
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
