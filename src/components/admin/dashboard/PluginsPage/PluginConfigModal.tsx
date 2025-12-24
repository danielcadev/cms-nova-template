'use client'

import { Eye, EyeOff, Globe, Info, Lock, RefreshCw, Save, ShieldAlert, Sparkles, X, Zap } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('plugins')
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

  // AI Assistant state
  const [aiConfig, setAiConfig] = useState({
    provider: 'google' as 'google' | 'openrouter',
    googleApiKey: '',
    googleModel: 'gemini-1.5-flash',
    openRouterApiKey: '',
    openRouterModel: 'google/gemini-2.0-flash-001',
  })

  const pluginId = plugin?.id || ''
  const isS3 = pluginId === 's3' || pluginId === 's3-storage'
  const isDynamicNav = pluginId === 'dynamic-nav'
  const isGemini = pluginId === 'google-gemini'

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

    if (isGemini) {
      setAiConfig({
        provider: (plugin.settings?.provider as 'google' | 'openrouter') || 'google',
        googleApiKey: plugin.settings?.googleApiKey || plugin.settings?.apiKey || '',
        googleModel: plugin.settings?.googleModel || plugin.settings?.model || 'gemini-1.5-flash',
        openRouterApiKey: plugin.settings?.openRouterApiKey || '',
        openRouterModel: plugin.settings?.openRouterModel || 'google/gemini-2.0-flash-001',
      })
    }
  }, [plugin, isS3, isDynamicNav, isGemini])

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
    if (isS3) return t('config.titles.s3')
    if (isDynamicNav) return t('config.titles.dynamicNav')
    return plugin?.name || t('config.titles.default')
  }, [isS3, isDynamicNav, plugin, t])

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
      } else if (isGemini) {
        await onSave(aiConfig)
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
                  {t('config.s3.bucket')}
                </Label>
                <Input
                  id={`${id}-bucket`}
                  value={s3Config.bucket}
                  onChange={(e) => setS3Config((prev) => ({ ...prev, bucket: e.target.value }))}
                  placeholder={t('config.s3.bucketPlaceholder')}
                  className="rounded-xl border-zinc-200 bg-zinc-50/50 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`${id}-region`}
                  className="text-xs font-medium text-zinc-500 uppercase tracking-wider"
                >
                  {t('config.s3.region')}
                </Label>
                <select
                  id={`${id}-region`}
                  value={s3Config.region}
                  onChange={(e) => setS3Config((prev) => ({ ...prev, region: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all text-sm"
                >
                  <option value="us-east-1">{t('config.s3.regions.us-east-1')}</option>
                  <option value="us-west-2">{t('config.s3.regions.us-west-2')}</option>
                  <option value="eu-west-1">{t('config.s3.regions.eu-west-1')}</option>
                  <option value="ap-southeast-1">{t('config.s3.regions.ap-southeast-1')}</option>
                  <option value="sa-east-1">{t('config.s3.regions.sa-east-1')}</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-zinc-500" />
                  {t('config.s3.credentials')}
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
                  {showSecrets ? t('config.s3.hideSecrets') : t('config.s3.showSecrets')}
                </Button>
              </div>

              {encryptionOk === false && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-red-900">{t('config.s3.encryptionMissing')}</p>
                    <p className="text-xs text-red-700 leading-relaxed">
                      {t('config.s3.encryptionDescription')}
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
                    {t('config.s3.accessKey')}
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
                    {t('config.s3.secretKey')}
                  </Label>
                  <Input
                    id={`${id}-secretAccessKey`}
                    type={showSecrets ? 'text' : 'password'}
                    value={s3Config.secretAccessKey}
                    onChange={(e) =>
                      setS3Config((prev) => ({ ...prev, secretAccessKey: e.target.value }))
                    }
                    placeholder={
                      hasExistingConfig ? t('config.s3.secretPlaceholderExisting') : t('config.s3.secretPlaceholder')
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
                {t('config.s3.instructions')}
              </div>
              <div className="space-y-2 text-xs text-blue-800">
                <p>
                  {t('config.s3.iamNotice')}
                </p>
                <p>{t('config.s3.corsNotice')}</p>
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
                  <Zap className="w-4 h-4" /> {t('config.dynamicNav.autoMode')}
                </div>
                <p className="text-xs text-zinc-500">{t('config.dynamicNav.autoDescription')}</p>
              </button>

              <button
                type="button"
                className={`cursor-pointer rounded-xl border p-4 transition-all text-left ${navConfig.mode === 'include' ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900' : 'border-zinc-200 hover:border-zinc-300'}`}
                onClick={() => setNavConfig((p) => ({ ...p, mode: 'include' }))}
              >
                <div className="flex items-center gap-2 font-medium text-sm mb-1">
                  <Globe className="w-4 h-4" /> {t('config.dynamicNav.manualMode')}
                </div>
                <p className="text-xs text-zinc-500">{t('config.dynamicNav.manualDescription')}</p>
              </button>
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                {t('config.dynamicNav.navItems')}
              </Label>
              <TypePathsSelector
                mode={navConfig.mode}
                include={navConfig.include}
                setInclude={(list) => setNavConfig((p) => ({ ...p, include: list }))}
              />

              <div className="flex gap-2">
                <Input
                  placeholder={t('config.dynamicNav.addCustom')}
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
                  {t('config.dynamicNav.add')}
                </Button>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                {t('config.dynamicNav.options')}
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
                  {t('config.dynamicNav.titleCase')}
                </Label>
              </div>
            </div>
          </div>
        )}

        {/* AI ASSISTANT CONFIG */}
        {isGemini && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  {t('config.gemini.provider')}
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAiConfig((p) => ({ ...p, provider: 'google' }))}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-sm font-medium ${aiConfig.provider === 'google'
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-600'
                      }`}
                  >
                    <Sparkles className={`w-4 h-4 ${aiConfig.provider === 'google' ? 'text-zinc-100' : 'text-zinc-400'}`} />
                    {t('config.gemini.providerGoogle')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiConfig((p) => ({ ...p, provider: 'openrouter' }))}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-sm font-medium ${aiConfig.provider === 'openrouter'
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-600'
                      }`}
                  >
                    <Globe className="w-4 h-4" />
                    {t('config.gemini.providerOpenRouter')}
                  </button>
                </div>
              </div>

              {aiConfig.provider === 'google' ? (
                <div className="space-y-4 pt-4 border-t border-zinc-100">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`${id}-google-key`}
                      className="text-xs font-medium text-zinc-500 uppercase tracking-wider"
                    >
                      {t('config.gemini.googleApiKey')}
                    </Label>
                    <div className="relative">
                      <Input
                        id={`${id}-google-key`}
                        type={showSecrets ? 'text' : 'password'}
                        value={aiConfig.googleApiKey}
                        onChange={(e) =>
                          setAiConfig((prev) => ({ ...prev, googleApiKey: e.target.value }))
                        }
                        placeholder={t('config.gemini.googleApiKeyPlaceholder')}
                        className="rounded-xl border-zinc-200 bg-zinc-50/50 focus:bg-white transition-all font-mono text-sm pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecrets(!showSecrets)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                      >
                        {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-400">
                      {t('config.gemini.instructions')}{' '}
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-900 underline"
                      >
                        Google AI Studio
                      </a>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`${id}-google-model`}
                      className="text-xs font-medium text-zinc-500 uppercase tracking-wider"
                    >
                      {t('config.gemini.model')}
                    </Label>
                    <select
                      id={`${id}-google-model`}
                      value={aiConfig.googleModel}
                      onChange={(e) => setAiConfig((prev) => ({ ...prev, googleModel: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all text-sm"
                    >
                      <option value="gemini-3-pro-preview">{t('config.gemini.model3Pro')}</option>
                      <option value="gemini-3-flash-preview">{t('config.gemini.model3Flash')}</option>
                      <option value="gemini-2.5-pro">{t('config.gemini.model25Pro')}</option>
                      <option value="gemini-2.5-flash">{t('config.gemini.model25Flash')}</option>
                      <option value="gemini-2.5-flash-lite">{t('config.gemini.model25FlashLite')}</option>
                      <option value="gemini-2.0-flash">{t('config.gemini.model20Flash')}</option>
                      <option value="gemini-2.0-flash-lite">{t('config.gemini.model20FlashLite')}</option>
                      <option value="gemini-1.5-pro">{t('config.gemini.model15Pro')}</option>
                      <option value="gemini-1.5-flash">{t('config.gemini.model15Flash')}</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-4 border-t border-zinc-100">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`${id}-openrouter-key`}
                      className="text-xs font-medium text-zinc-500 uppercase tracking-wider"
                    >
                      {t('config.gemini.openRouterApiKey')}
                    </Label>
                    <div className="relative">
                      <Input
                        id={`${id}-openrouter-key`}
                        type={showSecrets ? 'text' : 'password'}
                        value={aiConfig.openRouterApiKey}
                        onChange={(e) =>
                          setAiConfig((prev) => ({ ...prev, openRouterApiKey: e.target.value }))
                        }
                        placeholder={t('config.gemini.openRouterApiKeyPlaceholder')}
                        className="rounded-xl border-zinc-200 bg-zinc-50/50 focus:bg-white transition-all font-mono text-sm pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecrets(!showSecrets)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                      >
                        {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-400">
                      {t('config.gemini.instructions')}{' '}
                      <a
                        href="https://openrouter.ai/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-900 underline"
                      >
                        OpenRouter Dashboard
                      </a>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`${id}-openrouter-model`}
                      className="text-xs font-medium text-zinc-500 uppercase tracking-wider"
                    >
                      {t('config.gemini.model')}
                    </Label>
                    <Input
                      id={`${id}-openrouter-model`}
                      value={aiConfig.openRouterModel}
                      onChange={(e) =>
                        setAiConfig((prev) => ({ ...prev, openRouterModel: e.target.value }))
                      }
                      placeholder={t('config.gemini.openRouterModelPlaceholder')}
                      className="rounded-xl border-zinc-200 bg-zinc-50/50 focus:bg-white transition-all text-sm"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[
                        'google/gemini-2.0-flash-001',
                        'openai/gpt-4o-mini',
                        'anthropic/claude-3.5-haiku',
                        'deepseek/deepseek-chat',
                      ].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setAiConfig((prev) => ({ ...prev, openRouterModel: m }))}
                          className={`px-2 py-1 text-[10px] rounded-md border transition-all ${aiConfig.openRouterModel === m
                              ? 'bg-zinc-900 border-zinc-900 text-white font-medium'
                              : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-400'
                            }`}
                        >
                          {m.split('/')[1]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3">
              <Zap className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-emerald-900">{t('config.gemini.featuresTitle')}</p>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  {t('config.gemini.featuresDesc')}
                </p>
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
          {t('config.footer.cancel')}
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
          {isSaving ? t('config.footer.saving') : t('config.footer.save')}
        </Button>
      </ModalFooter>
    </ModalBase>
  )
}
