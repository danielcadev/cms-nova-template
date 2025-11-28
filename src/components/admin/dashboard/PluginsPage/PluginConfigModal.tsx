'use client'

import { Eye, EyeOff, Globe, Info, Lock, RefreshCw, Save, ShieldAlert, X, Zap } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ModalBase, ModalBody, ModalFooter } from '@/components/ui/Modal'
import type { Plugin } from '@/lib/plugins/config'
import { TypePathsSelector } from './TypePathsSelector'

interface PluginConfigModalProps {
  plugin: Plugin | null
  isOpen: boolean
  onClose: () => void
  onSave: (config: Record<string, any>) => Promise<void>
}

export function PluginConfigModal({ plugin, isOpen, onClose, onSave }: PluginConfigModalProps) {
  const id = useId()
  const titleCaseId = `${id}-title-case`

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
  const [hasExistingConfig, setHasExistingConfig] = useState(false)
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
      setS3Config({ bucket, region, accessKeyId, secretAccessKey: '' }) // Don't pre-fill secret
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

  // Check encryption status for S3
  useEffect(() => {
    let ignore = false
    async function check() {
      if (!isS3) {
        setEncryptionOk(null)
        return
      }

      const now = Date.now()
      const cached = encCacheRef.current
      if (cached && now - cached.ts < 30_000) {
        setEncryptionOk(cached.ok)
        return
      }

      try {
        const res = await fetch('/api/system/encryption-status', { cache: 'no-store' })
        const data = await res.json().catch(() => ({}))
        if (!ignore) {
          const ok = !!data.ok
          encCacheRef.current = { ok, ts: Date.now() }
          setEncryptionOk(ok)
        }
      } catch {
        if (!ignore) setEncryptionOk(false)
      }
    }
    check()
    return () => {
      ignore = true
    }
  }, [isS3])

  const title = useMemo(() => {
    if (isS3) return 'Configure S3 Storage'
    if (isDynamicNav) return 'Dynamic Navigation'
    return plugin?.name || 'Configure Plugin'
  }, [isS3, isDynamicNav, plugin])

  const handleSave = async () => {
    if (!plugin) return
    setIsSaving(true)
    try {
      if (isS3) {
        const payload = { ...s3Config }
        // If secret is empty and we have existing config, assume user didn't want to change it
        if (!payload.secretAccessKey && hasExistingConfig) {
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
      <div className="flex items-start justify-between p-6 pb-0">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-2xl shrink-0">
            {plugin.icon}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">{title}</h2>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-md">{plugin.description}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 -mr-2 -mt-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <ModalBody>
        {/* S3 STORAGE CONFIG */}
        {isS3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor={`${id}-bucket`}
                  className="text-xs font-medium text-zinc-500 uppercase tracking-wider"
                >
                  Bucket Name
                </Label>
                <Input
                  id={`${id}-bucket`}
                  value={s3Config.bucket}
                  onChange={(e) => setS3Config((prev) => ({ ...prev, bucket: e.target.value }))}
                  placeholder="e.g. my-cms-assets"
                  className="rounded-xl border-zinc-200 bg-zinc-50/50 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`${id}-region`}
                  className="text-xs font-medium text-zinc-500 uppercase tracking-wider"
                >
                  Region
                </Label>
                <select
                  id={`${id}-region`}
                  value={s3Config.region}
                  onChange={(e) => setS3Config((prev) => ({ ...prev, region: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all text-sm"
                >
                  <option value="us-east-1">US East (N. Virginia)</option>
                  <option value="us-west-2">US West (Oregon)</option>
                  <option value="eu-west-1">Europe (Ireland)</option>
                  <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                  <option value="sa-east-1">South America (São Paulo)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-zinc-500" />
                  AWS Credentials
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSecrets(!showSecrets)}
                  className="h-8 text-xs text-zinc-500 hover:text-zinc-900"
                >
                  {showSecrets ? (
                    <EyeOff className="h-3.5 w-3.5 mr-1.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  {showSecrets ? 'Hide Secrets' : 'Show Secrets'}
                </Button>
              </div>

              {encryptionOk === false && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-red-900">Encryption Key Missing</p>
                    <p className="text-xs text-red-700 leading-relaxed">
                      You must set the{' '}
                      <code className="px-1 py-0.5 bg-red-100 rounded">ENCRYPTION_KEY</code>{' '}
                      environment variable (64 hex chars) to securely store credentials. Saving is
                      disabled.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor={`${id}-accessKeyId`}
                    className="text-xs font-medium text-zinc-500 uppercase tracking-wider"
                  >
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
                    className="rounded-xl border-zinc-200 bg-zinc-50/50 focus:bg-white transition-all font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`${id}-secretAccessKey`}
                    className="text-xs font-medium text-zinc-500 uppercase tracking-wider"
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
                    placeholder={
                      hasExistingConfig ? '••••••••••••••••••••••••' : 'Enter your secret key'
                    }
                    disabled={encryptionOk === false}
                    className="rounded-xl border-zinc-200 bg-zinc-50/50 focus:bg-white transition-all font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-medium text-sm">
                <Info className="w-4 h-4" />
                Setup Instructions
              </div>
              <div className="space-y-2 text-xs text-blue-800">
                <p>
                  1. Ensure your IAM user has{' '}
                  <code className="px-1 py-0.5 bg-blue-100 rounded">AmazonS3FullAccess</code> or
                  equivalent.
                </p>
                <p>2. Add the following CORS configuration to your bucket permissions:</p>
                <pre className="bg-blue-900/5 p-2 rounded-lg overflow-x-auto font-mono text-[10px] text-blue-900 mt-1">
                  {`[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* DYNAMIC NAV CONFIG */}
        {isDynamicNav && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`cursor-pointer rounded-xl border p-4 transition-all text-left ${navConfig.mode === 'auto' ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900' : 'border-zinc-200 hover:border-zinc-300'}`}
                onClick={() => setNavConfig((p) => ({ ...p, mode: 'auto' }))}
              >
                <div className="flex items-center gap-2 font-medium text-sm mb-1">
                  <Zap className="w-4 h-4" /> Auto Mode
                </div>
                <p className="text-xs text-zinc-500">Automatically discover all content types.</p>
              </button>

              <button
                type="button"
                className={`cursor-pointer rounded-xl border p-4 transition-all text-left ${navConfig.mode === 'include' ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900' : 'border-zinc-200 hover:border-zinc-300'}`}
                onClick={() => setNavConfig((p) => ({ ...p, mode: 'include' }))}
              >
                <div className="flex items-center gap-2 font-medium text-sm mb-1">
                  <Globe className="w-4 h-4" /> Manual Mode
                </div>
                <p className="text-xs text-zinc-500">Manually select which types to include.</p>
              </button>
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Navigation Items
              </Label>
              <TypePathsSelector
                mode={navConfig.mode}
                include={navConfig.include}
                setInclude={(list) => setNavConfig((p) => ({ ...p, include: list }))}
              />

              <div className="flex gap-2">
                <Input
                  placeholder="Add custom path..."
                  value={manualTypePath}
                  onChange={(e) => setManualTypePath(e.target.value)}
                  className="rounded-xl border-zinc-200 bg-zinc-50/50"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (!manualTypePath.trim()) return
                    setNavConfig((p) => ({ ...p, include: [...p.include, manualTypePath.trim()] }))
                    setManualTypePath('')
                  }}
                  className="rounded-xl border-zinc-200"
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Options
              </Label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={titleCaseId}
                  checked={navConfig.titleCase}
                  onChange={(e) => setNavConfig((p) => ({ ...p, titleCase: e.target.checked }))}
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                />
                <Label htmlFor={titleCaseId} className="text-sm font-normal">
                  Format labels as Title Case (e.g. "Blog Posts")
                </Label>
              </div>
            </div>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <Button
          variant="outline"
          onClick={onClose}
          className="rounded-xl border-zinc-200 text-zinc-700 hover:bg-zinc-50"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving || (isS3 && encryptionOk === false)}
          className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/20"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </ModalFooter>
    </ModalBase>
  )
}
