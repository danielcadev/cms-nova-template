'use client';

import { AdminLayout } from '../../AdminLayout';
import { ContentTypesPageContent } from './ContentTypesPageContent';
import { useContentTypes } from './useContentTypes';

export default function ContentTypesManager() {
  const {
    contentTypes,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filteredContentTypes,
    refreshContentTypes
  } = useContentTypes();

  return (
    <AdminLayout>
      <ContentTypesPageContent 
        contentTypes={contentTypes}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filteredContentTypes={filteredContentTypes}
        onRefresh={refreshContentTypes}
      />
    </AdminLayout>
  );
}
