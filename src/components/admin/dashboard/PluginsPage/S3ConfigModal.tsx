'use client';

import { useState, useEffect } from 'react';
import { X, Save, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plugin } from '@/lib/plugins/config';

interface S3ConfigModalProps {
  plugin: Plugin;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: Record<string, any>) => void;
}

export function S3ConfigModal({ plugin, isOpen, onClose, onSave }: S3ConfigModalProps) {
  const [config, setConfig] = useState({
    bucket: '',
    region: 'us-east-1',
    accessKeyId: '',
    secretAccessKey: ''
  });
  const [showSecrets, setShowSecrets] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (plugin.settings) {
      setConfig({
        bucket: plugin.settings.bucket || '',
        region: plugin.settings.region || 'us-east-1',
        accessKeyId: plugin.settings.accessKeyId || '',
        secretAccessKey: plugin.settings.secretAccessKey || ''
      });
    }
  }, [plugin.settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(config);
      onClose();
    } catch (error) {
      console.error('Error saving S3 config:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="text-2xl">☁️</div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                Configurar AWS S3 Storage
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configura tu bucket de S3 para almacenamiento de archivos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Bucket Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Configuración del Bucket
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bucket" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre del Bucket
                </Label>
                <Input
                  id="bucket"
                  value={config.bucket}
                  onChange={(e) => setConfig(prev => ({ ...prev, bucket: e.target.value }))}
                  placeholder="mi-bucket-s3"
                  className="rounded-lg border-gray-200 dark:border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="region" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Región
                </Label>
                <select
                  id="region"
                  value={config.region}
                  onChange={(e) => setConfig(prev => ({ ...prev, region: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Credenciales de AWS
              </h3>
              <button
                onClick={() => setShowSecrets(!showSecrets)}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showSecrets ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accessKeyId" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Access Key ID
                </Label>
                <Input
                  id="accessKeyId"
                  type={showSecrets ? 'text' : 'password'}
                  value={config.accessKeyId}
                  onChange={(e) => setConfig(prev => ({ ...prev, accessKeyId: e.target.value }))}
                  placeholder="AKIA..."
                  className="rounded-lg border-gray-200 dark:border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secretAccessKey" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Secret Access Key
                </Label>
                <Input
                  id="secretAccessKey"
                  type={showSecrets ? 'text' : 'password'}
                  value={config.secretAccessKey}
                  onChange={(e) => setConfig(prev => ({ ...prev, secretAccessKey: e.target.value }))}
                  placeholder="••••••••••••••••••••••••••••••••••••••••"
                  className="rounded-lg border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>
          </div>



          {/* Policy de S3 */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-3">
              🔒 Policy de S3 requerida
            </h4>
            <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
              Agrega esta policy a tu bucket S3 para permitir acceso público a las imágenes:
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
      "Resource": "arn:aws:s3:::${config.bucket || 'TU-BUCKET'}/*"
    }
  ]
}`}
              </pre>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
              Reemplaza "TU-BUCKET" con el nombre de tu bucket si no lo has llenado arriba.
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              💡 Información importante
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Asegúrate de que el bucket tenga los permisos correctos</li>
              <li>• Las credenciales se almacenan de forma segura</li>
              <li>• La policy permite acceso público solo para lectura</li>
              <li>• Los archivos se acceden directamente desde S3</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300 dark:border-gray-700"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !config.bucket || !config.accessKeyId || !config.secretAccessKey}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" strokeWidth={1.5} />
            {isSaving ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </div>
      </div>
    </div>
  );
}