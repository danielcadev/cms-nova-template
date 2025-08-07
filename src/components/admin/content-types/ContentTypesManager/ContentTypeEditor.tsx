'use client';

import React from 'react';
import ContentTypeForm from './ContentTypeForm';
import { useContentType } from './useContentTypes';
import { AlertCircle } from 'lucide-react';

interface ContentTypeEditorProps {
  id: string;
}

export function ContentTypeEditor({ id }: ContentTypeEditorProps) {
  const { contentType, isLoading, error } = useContentType(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <p className="text-red-600">
            Error al cargar el tipo de contenido: {error}
          </p>
        </div>
      </div>
    );
  }

  if (!contentType) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <p className="text-amber-600">
            No se encontró el tipo de contenido con ID: {id}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ContentTypeForm 
      initialData={contentType}
      contentTypeId={id}
    />
  );
}
