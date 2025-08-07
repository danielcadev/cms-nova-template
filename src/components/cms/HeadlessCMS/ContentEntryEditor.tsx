'use client';

/**
 * NOVA CMS - CONTENT ENTRY EDITOR
 * ================================
 * 
 * Editor específico para una entrada de contenido del headless CMS.
 * Combina DynamicContentForm con lógica de guardado específica.
 */

import { useState, useEffect } from 'react';
import { DynamicContentForm } from './DynamicContentForm';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface ContentEntryEditorProps {
  contentTypeId: string;
  entryId?: string; // undefined para crear, string para editar
  mode?: 'create' | 'edit';
}

export function ContentEntryEditor({ 
  contentTypeId, 
  entryId, 
  mode = 'create' 
}: ContentEntryEditorProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [contentType, setContentType] = useState<any>(null);
  const [initialData, setInitialData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [contentTypeId, entryId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Obtener el content type
      const typeResponse = await fetch(`/api/content-types/${contentTypeId}`);
      if (!typeResponse.ok) throw new Error('Error al cargar content type');
      const typeData = await typeResponse.json();
      setContentType(typeData);

      // Si estamos editando, obtener los datos de la entrada
      if (mode === 'edit' && entryId) {
        const entryResponse = await fetch(`/api/content/entries/${entryId}`);
        if (!entryResponse.ok) throw new Error('Error al cargar entrada');
        const entryData = await entryResponse.json();
        setInitialData(entryData.data || {});
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los datos.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Record<string, any>) => {
    try {
      const url = mode === 'create' 
        ? `/api/content/${contentTypeId}/entries`
        : `/api/content/entries/${entryId}`;
      
      const method = mode === 'create' ? 'POST' : 'PATCH';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar');
      }

      const result = await response.json();
      
      toast({
        title: mode === 'create' ? 'Contenido creado' : 'Contenido actualizado',
        description: 'Los cambios se han guardado exitosamente.',
      });

      // Redirigir a la lista después de crear
      if (mode === 'create') {
        router.push(`/admin/content-types/${contentTypeId}/entries`);
      }
    } catch (error) {
      throw error; // Re-lanzar para que DynamicContentForm maneje el error
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!contentType) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No se pudo cargar el tipo de contenido.</p>
      </div>
    );
  }

  return (
    <DynamicContentForm
      contentType={contentType}
      initialData={initialData}
      entryId={entryId}
      mode={mode}
      onSave={handleSave}
    />
  );
}
