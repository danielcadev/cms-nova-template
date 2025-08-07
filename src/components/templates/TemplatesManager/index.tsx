'use client';

import { useState } from 'react';
import { AdminLayout } from '../../admin/AdminLayout';
import { TemplatesPageContent } from './TemplatesPageContent';
import { usePlans } from './usePlans';

export default function TemplatesManager() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { plans, isLoading, error } = usePlans();

  return (
    <AdminLayout>
      <TemplatesPageContent 
        selectedTemplate={selectedTemplate}
        onSelectTemplate={setSelectedTemplate}
        plans={plans}
        isLoading={isLoading}
        error={error}
      />
    </AdminLayout>
  );
}
