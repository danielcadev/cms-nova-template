'use client';

import { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Settings, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Field {
  id: string;
  label: string;
  apiIdentifier: string;
  type: string;
  isRequired: boolean;
}

interface DynamicFieldRendererProps {
  field: Field;
  value: any;
  onChange: (value: any) => void;
}

interface ImageDropZoneProps {
  fieldId: string;
  isUploading: boolean;
  onFileSelect: (file: File) => void;
}

function ImageDropZone({ fieldId, isUploading, onFileSelect }: ImageDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onFileSelect(imageFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
        isDragOver
          ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
      } ${isUploading ? 'pointer-events-none opacity-75' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isUploading && document.getElementById(`file-${fieldId}`)?.click()}
    >
      {/* Loading overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 rounded-xl flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600 mx-auto mb-3"></div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Subiendo imagen...</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Esto puede tomar unos segundos</p>
          </div>
        </div>
      )}

      <div className="text-center">
        {/* Icon with animation */}
        <div className={`mx-auto mb-4 transition-transform duration-200 ${isDragOver ? 'scale-110' : ''}`}>
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center">
            <ImageIcon className={`h-8 w-8 transition-colors duration-200 ${
              isDragOver ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
            }`} />
          </div>
        </div>

        {/* Main text */}
        <div className="mb-4">
          <h3 className={`text-lg font-semibold mb-2 transition-colors duration-200 ${
            isDragOver 
              ? 'text-blue-700 dark:text-blue-300' 
              : 'text-gray-900 dark:text-gray-100'
          }`}>
            {isDragOver ? '¡Suelta la imagen aquí!' : 'Subir imagen'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isDragOver 
              ? 'Suelta el archivo para subirlo' 
              : 'Arrastra y suelta una imagen o haz clic para seleccionar'
            }
          </p>
        </div>

        {/* Action button */}
        <div className="mb-4">
          <div className={`inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
            isDragOver
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}>
            <Upload className="h-4 w-4 mr-2" />
            {isDragOver ? 'Soltar archivo' : 'Seleccionar archivo'}
          </div>
        </div>

        {/* File info */}
        <div className="space-y-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Formatos soportados: PNG, JPG, GIF, WebP
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Tamaño máximo: 10MB
          </p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              Se almacenará en AWS S3
            </p>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        id={`file-${fieldId}`}
        type="file"
        className="sr-only"
        accept="image/*"
        disabled={isUploading}
        onChange={handleFileChange}
      />
    </div>
  );
}

export function DynamicFieldRenderer({ field, value, onChange }: DynamicFieldRendererProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [s3Configured, setS3Configured] = useState<boolean | null>(null);
  const [isCheckingS3, setIsCheckingS3] = useState(true);

  // Verificar si S3 está configurado cuando el componente se monta
  useEffect(() => {
    const checkS3Configuration = async () => {
      try {
        const response = await fetch('/api/plugins/s3');
        const data = await response.json();
        setS3Configured(data.success && data.config !== null);
      } catch (error) {
        console.error('Error checking S3 configuration:', error);
        setS3Configured(false);
      } finally {
        setIsCheckingS3(false);
      }
    };

    // Solo verificar S3 si el campo es de tipo MEDIA
    if (field.type === 'MEDIA') {
      checkS3Configuration();
    } else {
      setIsCheckingS3(false);
    }
  }, [field.type]);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'content');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        onChange({
          url: result.url,
          fileName: result.fileName,
          size: result.size,
          type: result.type
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al subir el archivo');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Mostrar error más específico
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al subir el archivo';
      
      // Si el error es de S3 no configurado, actualizar el estado
      if (errorMessage.includes('S3 no está configurado')) {
        setS3Configured(false);
      }
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  switch (field.type) {
    case 'TEXT':
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={`Ingresa ${field.label.toLowerCase()}`}
        />
      );

    case 'RICH_TEXT':
      return (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          placeholder={`Ingresa ${field.label.toLowerCase()}`}
        />
      );

    case 'NUMBER':
      return (
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={`Ingresa ${field.label.toLowerCase()}`}
        />
      );

    case 'BOOLEAN':
      return (
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label className="text-sm text-gray-700 dark:text-gray-300">
            {field.label}
          </label>
        </div>
      );

    case 'DATE':
      return (
        <input
          type="date"
          value={value ? new Date(value).toISOString().split('T')[0] : ''}
          onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      );

    case 'MEDIA':
      // Mostrar loading mientras verifica S3
      if (isCheckingS3) {
        return (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900 dark:border-gray-700 dark:border-t-gray-100 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Verificando configuración...</p>
            </div>
          </div>
        );
      }

      // Mostrar mensaje si S3 no está configurado
      if (s3Configured === false) {
        return (
          <div className="border-2 border-dashed border-amber-300 dark:border-amber-600 rounded-lg p-6 bg-amber-50 dark:bg-amber-900/20">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
              <div className="mt-4">
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                  S3 no configurado
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-300 mb-4">
                  Para subir imágenes necesitas configurar AWS S3 primero
                </p>
                <Link href="/admin/dashboard/plugins">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar S3
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        );
      }

      // Renderizar el campo de imagen normal si S3 está configurado
      return (
        <div className="space-y-4">
          {value?.url ? (
            <div className="relative">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={value.url}
                      alt={value.fileName || 'Imagen'}
                      className="w-20 h-20 object-cover rounded-lg shadow-sm"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {value.fileName || 'Imagen'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {value.size ? `${Math.round(value.size / 1024)} KB` : ''}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Almacenado en S3
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onChange(null)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <ImageDropZone 
              fieldId={field.id}
              isUploading={isUploading}
              onFileSelect={handleFileUpload}
            />
          )}
        </div>
      );

    default:
      return (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Tipo de campo no soportado: {field.type}
          </p>
        </div>
      );
  }
}