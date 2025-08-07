'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import PluginsPage from '@/components/admin/dashboard/PluginsPage';

export default function Page() {
  return (
    <AdminLayout>
      <PluginsPage />
    </AdminLayout>
  );
} 
