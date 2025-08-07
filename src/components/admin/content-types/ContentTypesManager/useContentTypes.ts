'use client';

import { useState, useEffect, useMemo } from 'react';

interface ContentType {
  id: string;
  name: string;
  apiIdentifier: string;
  description?: string;
  fields: any[];
  createdAt: string;
  updatedAt: string;
}

export function useContentTypes() {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch content types
  useEffect(() => {
    async function fetchContentTypes() {
      try {
        console.log('🟢 useContentTypes - Fetching content types...');
        setLoading(true);
        const response = await fetch('/api/content-types');
        
        if (response.ok) {
          const data = await response.json();
          // La respuesta real tiene esta estructura: { success: true, data: { contentTypes: [...] } }
          const contentTypesArray = data.data?.contentTypes || data.contentTypes || [];
          console.log('🟢 useContentTypes - Loaded', contentTypesArray.length, 'content types');
          
          setContentTypes(contentTypesArray);
        } else {
          console.error('🔴 useContentTypes - Response not ok:', response.status);
          setError('Error al cargar tipos de contenido');
        }
      } catch (error) {
        console.error('🔴 useContentTypes - Error fetching content types:', error);
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    }

    fetchContentTypes();
  }, []);

  // Filter content types
  const filteredContentTypes = useMemo(() => {
    return contentTypes.filter(contentType => {
      const matchesSearch = !searchTerm || 
        contentType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contentType.apiIdentifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contentType.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [contentTypes, searchTerm]);

  // Refresh content types
  const refreshContentTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/content-types');
      if (response.ok) {
        const data = await response.json();
        // La respuesta real tiene esta estructura: { success: true, data: { contentTypes: [...] } }
        const contentTypesArray = data.data?.contentTypes || data.contentTypes || [];
        setContentTypes(contentTypesArray);
      } else {
        setError('Error al cargar tipos de contenido');
      }
    } catch (error) {
      console.error('Error refreshing content types:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return {
    contentTypes,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filteredContentTypes,
    refreshContentTypes
  };
}

// Hook individual para obtener un solo content type
export function useContentType(id: string) {
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContentType = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/content-types/${id}`);
      if (!response.ok) {
        throw new Error('Error al cargar tipo de contenido');
      }
      
      const responseData = await response.json();
      console.log('🟢 useContentType - Raw response:', responseData);
      
      // La respuesta tiene la estructura: { success: true, data: { contentType details } }
      const contentTypeData = responseData.data || responseData;
      console.log('🟢 useContentType - Content type data:', contentTypeData);
      
      setContentType(contentTypeData);
    } catch (err) {
      console.error('Error fetching content type:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchContentType();
    }
  }, [id]);

  return {
    contentType,
    isLoading,
    error,
    refetch: fetchContentType
  };
}
