'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DynamicFieldRenderer } from '../DynamicFieldRenderer';

interface ContentType {
  id: string;
  name: string;
  apiIdentifier: string;
  description?: string | null;
  fields: Field[];
}

interface Field {
  id: string;
  label: string;
  apiIdentifier: string;
  type: string;
  isRequired: boolean;
}

interface ContentEntry {
  id: string;
  data: any;
  status: string;
  createdAt: string;
  updatedAt: string;
  contentType: ContentType;
}

interface EditContentEntryPageProps {
  entry: ContentEntry;
}

export function EditContentEntryPage({ entry }: EditContentEntryPageProps) {
  const [formData, setFormData] = useState<Record<string, any>>(entry.data || {});
  const [status, setStatus] = useState(entry.status);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSave = async (saveStatus: string = status) => {
    setIsSaving(true);
    
    try {
      const response = await fetch(`/api/content-types/${entry.contentType.apiIdentifier}/entries/${entry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: formData,
          status: saveStatus
        }),
      });

      if (response.ok) {
        router.push(`/admin/dashboard/content-types/${entry.contentType.apiIdentifier}/content`);
      } else {
        throw new Error('Error al actualizar la entrada');
      }
    } catch (error) {
      console.error('Error updating entry:', error);
      alert('Error al actualizar la entrada');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta entrada? Esta acción no se puede deshacer.')) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/content-types/${entry.contentType.apiIdentifier}/entries/${entry.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        router.push(`/admin/dashboard/content-types/${entry.contentType.apiIdentifier}/content`);
      } else {
        throw new Error('Error al eliminar la entrada');
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Error al eliminar la entrada');
    } finally {
      setIsDeleting(false);
    }
  };

  const validateForm = () => {
    const requiredFields = entry.contentType.fields.filter(field => field.isRequired);
    return requiredFields.every(field => {
      const value = formData[field.apiIdentifier];
      return value !== undefined && value !== null && value !== '';
    });
  };

  const isFormValid = validateForm();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href={`/admin/dashboard/content-types/${entry.contentType.apiIdentifier}/content`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              
              <div>
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                  Editar {entry.contentType.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Modifica los campos de esta entrada
                </p>
              </div>
            </div>

            {/* Meta info */}
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Creado: {new Date(entry.createdAt).toLocaleString()} • 
              Actualizado: {new Date(entry.updatedAt).toLocaleString()}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Estado:
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicada</option>
                  <option value="archived">Archivada</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? 'Eliminando...' : 'Eliminar'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleSave('draft')}
                  disabled={isSaving}
                >
                  Guardar como borrador
                </Button>
                
                <Button
                  onClick={() => handleSave(status)}
                  disabled={isSaving || !isFormValid}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="space-y-6">
              {entry.contentType.fields.map(field => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {field.label}
                    {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  <DynamicFieldRenderer
                    field={field}
                    value={formData[field.apiIdentifier]}
                    onChange={(value) => handleFieldChange(field.apiIdentifier, value)}
                  />
                  
                  {field.isRequired && !formData[field.apiIdentifier] && (
                    <p className="text-red-500 text-xs mt-1">Este campo es obligatorio</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}