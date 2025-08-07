'use client';

/**
 * NOVA CMS - CONTENT PREVIEW
 * ===========================
 * 
 * Vista previa de contenido del headless CMS.
 * Muestra el contenido de una entrada de forma legible.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  Hash, 
  ToggleRight, 
  Image as ImageIcon,
  ExternalLink 
} from 'lucide-react';

interface Field {
  id: string;
  label: string;
  apiIdentifier: string;
  type: 'TEXT' | 'RICH_TEXT' | 'NUMBER' | 'BOOLEAN' | 'DATE' | 'MEDIA';
  isRequired: boolean;
}

interface ContentType {
  id: string;
  name: string;
  apiIdentifier: string;
  description?: string;
  fields: Field[];
}

interface ContentPreviewProps {
  contentType: ContentType;
  data: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export function ContentPreview({ 
  contentType, 
  data, 
  createdAt, 
  updatedAt 
}: ContentPreviewProps) {
  const getFieldIcon = (type: Field['type']) => {
    switch (type) {
      case 'TEXT':
      case 'RICH_TEXT':
        return <FileText className="h-4 w-4" />;
      case 'NUMBER':
        return <Hash className="h-4 w-4" />;
      case 'BOOLEAN':
        return <ToggleRight className="h-4 w-4" />;
      case 'DATE':
        return <Calendar className="h-4 w-4" />;
      case 'MEDIA':
        return <ImageIcon className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatValue = (value: any, field: Field) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400 italic">Sin valor</span>;
    }

    switch (field.type) {
      case 'TEXT':
        return <span className="text-gray-900">{String(value)}</span>;
      
      case 'RICH_TEXT':
        return (
          <div className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded-md border">
            {String(value)}
          </div>
        );
      
      case 'NUMBER':
        return (
          <span className="text-gray-900 font-mono">
            {Number(value).toLocaleString()}
          </span>
        );
      
      case 'BOOLEAN':
        return (
          <Badge variant={value ? "default" : "secondary"}>
            {value ? '✅ Sí' : '❌ No'}
          </Badge>
        );
      
      case 'DATE':
        return (
          <span className="text-gray-900">
            {new Date(value).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        );
      
      case 'MEDIA':
        const isUrl = typeof value === 'string' && value.startsWith('http');
        return isUrl ? (
          <div className="space-y-2">
            <a 
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Ver archivo
            </a>
            {value.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
              <img 
                src={value} 
                alt="Preview"
                className="max-w-xs rounded-md border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </div>
        ) : (
          <span className="text-gray-900">{String(value)}</span>
        );
      
      default:
        return <span className="text-gray-900">{String(value)}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{contentType.name}</CardTitle>
              {contentType.description && (
                <p className="text-gray-600 mt-1">{contentType.description}</p>
              )}
            </div>
            <Badge variant="outline">
              {contentType.apiIdentifier}
            </Badge>
          </div>
          {(createdAt || updatedAt) && (
            <div className="flex gap-4 text-sm text-gray-500 pt-2 border-t">
              {createdAt && (
                <span>
                  Creado: {new Date(createdAt).toLocaleDateString()}
                </span>
              )}
              {updatedAt && (
                <span>
                  Actualizado: {new Date(updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Fields */}
      <div className="grid gap-4">
        {contentType.fields.map((field) => (
          <Card key={field.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-gray-500 mt-0.5">
                  {getFieldIcon(field.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900">
                      {field.label}
                    </h3>
                    {field.isRequired && (
                      <Badge variant="destructive" className="text-xs">
                        Requerido
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {field.type}
                    </Badge>
                  </div>
                  <div className="break-words">
                    {formatValue(data[field.apiIdentifier], field)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Debug Info (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Debug - Datos Raw</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
