'use client'

import { Eye, EyeOff, Save, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Plugin } from '@/lib/plugins/config'

interface S3ConfigModalProps {
  plugin: Plugin
  isOpen: boolean
  onClose: () => void
  onSave: (config: Record<string, any>) => void
}

export function S3ConfigModal({ plugin, isOpen, onClose, onSave }: S3ConfigModalProps) {
  const id = useId()
  const [config, setConfig] = useState({
    bucket: '',
    region: 'us-east-1',
    accessKeyId: '',
    secretAccessKey: '',
  })
  const [showSecrets, setShowSecrets] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (plugin.settings) {
      setConfig({
        bucket: plugin.settings.bucket || '',
        region: plugin.settings.region || 'us-east-1',
        accessKeyId: plugin.settings.accessKeyId || '',
        secretAccessKey: plugin.settings.secretAccessKey || '',
      })
    }
  }, [plugin.settings])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(config)
      onClose()
    } catch (error) {
      console.error('Error saving S3 config:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="theme-card rounded-xl shadow-xl border theme-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b theme-border">
          <div className="flex items-center gap-3">
            <div className="text-2xl">☁️</div>
            <div>
              <h2 className="text-xl font-semibold theme-text tracking-tight">
                Configure AWS S3 Storage
              </h2>
              <p className="text-sm theme-text-secondary">Set up your S3 bucket for file storage</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:theme-card-hover"
          >
            <X className="h-5 w-5 theme-text-secondary" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
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
                  value={config.bucket}
                  onChange={(e) => setConfig((prev) => ({ ...prev, bucket: e.target.value }))}
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
                  value={config.region}
                  onChange={(e) => setConfig((prev) => ({ ...prev, region: e.target.value }))}
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
                  value={config.accessKeyId}
                  onChange={(e) => setConfig((prev) => ({ ...prev, accessKeyId: e.target.value }))}
                  placeholder="AKIA..."
                  className="rounded-lg theme-border theme-card theme-text placeholder:theme-text-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-secretAccessKey`} className="text-sm font-medium theme-text">
                  Secret Access Key
                </Label>
                <Input
                  id={`${id}-secretAccessKey`}
                  type={showSecrets ? 'text' : 'password'}
                  value={config.secretAccessKey}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, secretAccessKey: e.target.value }))
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
              <pre className="text-xs text-green-400 whitespace-pre-wrap">
                {`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${config.bucket || 'YOUR-BUCKET'}/*"
    }
  ]
}`}
              </pre>
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
              <pre className="text-xs text-blue-300 whitespace-pre-wrap">
                {`[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://tu-dominio.com"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]`}
              </pre>
            </div>
            <p className="text-xs text-sky-700 dark:text-sky-300 mt-2">
              Update <code>tu-dominio.com</code> with your real domain. Without this, presigned
              uploads will fallback to server uploads.
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

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t theme-border">
          <Button variant="outline" onClick={onClose} className="theme-border">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !config.bucket || !config.accessKeyId || !config.secretAccessKey}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" strokeWidth={1.5} />
            {isSaving ? 'Saving...' : 'Save configuration'}
          </Button>
        </div>
      </div>
    </div>
  )
}
