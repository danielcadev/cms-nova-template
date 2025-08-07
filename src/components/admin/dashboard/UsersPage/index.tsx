'use client';

import { useState } from 'react';
import { Users, UserPlus, RefreshCw, Shield, CheckCircle, Clock } from 'lucide-react';
import { useUsers } from '@/hooks/use-users';
import { useToast } from '@/hooks/use-toast';
import type { User as UserType } from '@/types/user';

// Componentes modulares
import { UsersGrid } from './UsersGrid';
import { UserDetailModal } from './UserDetailModal';

export function UsersPage() {
  const { users, loading, updateUserRole, refreshUsers } = useUsers();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtrar usuarios
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estadísticas
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    verified: users.filter(u => u.emailVerified).length,
    newThisMonth: users.filter(u => {
      if (!u.createdAt) return false;
      const userDate = new Date(u.createdAt);
      const now = new Date();
      return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
    }).length
  };

  // Determinar el primer usuario (el más antiguo)
  const firstUser = users.length > 0 ? users.reduce((oldest, current) => 
    new Date(oldest.createdAt) < new Date(current.createdAt) ? oldest : current
  ) : null;

  // Handlers
  const handleViewDetails = (user: UserType) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshUsers();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleUpdateRole = async (userId: string, role: 'ADMIN' | 'USER') => {
    try {
      await updateUserRole(userId, role);
      await refreshUsers();
      toast({
        title: "Éxito",
        description: "Rol actualizado correctamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    toast({
      title: "Función no disponible",
      description: "La eliminación de usuarios estará disponible próximamente",
      variant: "destructive"
    });
  };

  const handleToggleBan = async (userId: string, shouldBan: boolean) => {
    toast({
      title: "Función no disponible",
      description: "El baneo de usuarios estará disponible próximamente",
      variant: "destructive"
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900 dark:border-gray-700 dark:border-t-gray-100 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-center text-sm">Cargando usuarios...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 relative">
      {/* Clean editorial background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-gray-950 dark:to-gray-900/50" />

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Editorial header */}
          <div className="mb-16">
            <div className="flex items-start justify-between mb-12">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-medium text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
                  Gestión de usuarios
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 font-light tracking-wide">Administra usuarios, roles y permisos del sistema</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw className={`h-4 w-4 transition-transform duration-200 ${isRefreshing ? 'animate-spin' : ''}`} strokeWidth={1.5} />
                    {isRefreshing ? 'Actualizando...' : 'Actualizar'}
                  </div>
                </button>
                <button className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" strokeWidth={1.5} />
                    Invitar usuario
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Editorial Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div className="text-right">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{stats.total}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total usuarios</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-2 h-2 bg-slate-500 rounded-full mt-2" />
                <div className="text-right">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{stats.admins}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Administradores</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2" />
                <div className="text-right">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{stats.verified}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Verificados</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
                <div className="text-right">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{stats.newThisMonth}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Nuevos este mes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Users grid */}
          <div className="mb-8">
            <UsersGrid
              users={filteredUsers}
              loading={loading}
              error={null}
              onViewDetails={handleViewDetails}
            />
          </div>

          {/* User Detail Modal */}
          <UserDetailModal
            user={selectedUser}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onUpdateRole={handleUpdateRole}
            onDeleteUser={handleDeleteUser}
            onToggleBan={handleToggleBan}
            isFirstUser={selectedUser?.id === firstUser?.id}
          />
        </div>
      </div>
    </div>
  );
}