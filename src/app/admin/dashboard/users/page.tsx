import { UsersPage } from '@/components/admin/dashboard/UsersPage';
import { AdminLayout } from '@/components/admin/AdminLayout';
 
export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <UsersPage />
    </AdminLayout>
  );
}