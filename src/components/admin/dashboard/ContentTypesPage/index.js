'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { ContentTypesPageContent } from '@/components/admin/content-types/ContentTypesManager/ContentTypesPageContent';
export function ContentTypesPage({ initialContentTypes }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [contentTypes] = useState(initialContentTypes);
    // Filtrar content types
    const filteredContentTypes = contentTypes.filter(ct => ct.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ct.apiIdentifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ct.description && ct.description.toLowerCase().includes(searchTerm.toLowerCase())));
    const handleRefresh = () => {
        setLoading(true);
        // Recargar la página para obtener datos frescos
        window.location.reload();
    };
    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };
    return (_jsx(ContentTypesPageContent, { contentTypes: contentTypes, loading: loading, error: error, searchTerm: searchTerm, onSearchChange: handleSearchChange, filteredContentTypes: filteredContentTypes, onRefresh: handleRefresh }));
}
//# sourceMappingURL=index.js.map