'use client';

import { useState } from 'react';
import { ContentTypesPageContent } from '@/components/admin/content-types/ContentTypesManager/ContentTypesPageContent';

interface ContentTypeData {
  id: string;
  name: string;
  apiIdentifier: string;
  description?: string | null;
  fields: any[];
  createdAt: string;
  updatedAt: string;
}

interface ContentTypesPageProps {
  initialContentTypes: ContentTypeData[];
}

export function ContentTypesPage({ initialContentTypes }: ContentTypesPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [contentTypes] = useState(initialContentTypes);

  // Filtrar content types
  const filteredContentTypes = contentTypes.filter(ct =>
    ct.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ct.apiIdentifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ct.description && ct.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRefresh = () => {
    setLoading(true);
    // Recargar la página para obtener datos frescos
    window.location.reload();
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <ContentTypesPageContent
      contentTypes={contentTypes}
      loading={loading}
      error={error}
      searchTerm={searchTerm}
      onSearchChange={handleSearchChange}
      filteredContentTypes={filteredContentTypes}
      onRefresh={handleRefresh}
    />
  );
}