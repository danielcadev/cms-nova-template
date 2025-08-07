import { AdminLayout } from '@/components/admin/AdminLayout';
import { CreateContentTypePage } from '@/components/admin/dashboard/CreateContentTypePage';

export default function CreateContentTypePageRoute() {
  return (
    <AdminLayout>
      <CreateContentTypePage />
    </AdminLayout>
  );
}
