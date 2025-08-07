'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  User,
  Mail,
  Calendar,
  Shield,
  Activity,
  Crown,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User as UserType } from '@/types/user';

interface UserDetailModalProps {
  user: UserType | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateRole?: (userId: string, role: 'ADMIN' | 'USER') => Promise<void>;
  onDeleteUser?: (userId: string) => Promise<void>;
  onToggleBan?: (userId: string, shouldBan: boolean) => Promise<void>;
  isFirstUser?: boolean;
}

export function UserDetailModal({
  user,
  isOpen,
  onClose,
  onUpdateRole,
  onDeleteUser,
  onToggleBan,
  isFirstUser = false
}: UserDetailModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'from-blue-500 to-blue-600';
      case 'editor':
        return 'from-emerald-500 to-emerald-600';
      case 'user':
        return 'from-slate-500 to-slate-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const handleRoleUpdate = async (newRole: 'ADMIN' | 'USER') => {
    if (!onUpdateRole) return;
    
    // Proteger al primer usuario de perder privilegios de admin
    if (isFirstUser && newRole === 'USER') {
      alert('No se puede quitar el rol de admin al primer usuario del sistema por seguridad.');
      return;
    }
    
    setIsUpdating(true);
    try {
      await onUpdateRole(user.id, newRole);
      onClose();
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!onDeleteUser) return;
    
    // Proteger al primer usuario (admin principal)
    if (isFirstUser) {
      alert('No se puede eliminar el primer usuario del sistema por seguridad.');
      return;
    }
    
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
      setIsUpdating(true);
      try {
        await onDeleteUser(user.id);
        onClose();
      } catch (error) {
        console.error('Error deleting user:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleToggleBan = async () => {
    if (!onToggleBan) return;
    
    const shouldBan = !user.banned;
    const action = shouldBan ? 'banear' : 'desbanear';
    
    // Proteger al primer usuario de ser baneado
    if (isFirstUser && shouldBan) {
      alert('No se puede banear al primer usuario del sistema por seguridad.');
      return;
    }
    
    if (window.confirm(`¿Estás seguro de que quieres ${action} a este usuario?`)) {
      setIsUpdating(true);
      try {
        await onToggleBan(user.id, shouldBan);
        onClose();
      } catch (error) {
        console.error('Error toggling ban:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Transparent overlay */}
      <div 
        className="absolute inset-0 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative bg-white/10 dark:bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="relative p-8 pb-6">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/10 dark:hover:bg-white/5 rounded-xl transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-slate-700 dark:from-white dark:via-blue-400 dark:to-slate-300 bg-clip-text text-transparent">
            Detalles del Usuario
          </h2>
        </div>

        <div className="px-8 pb-8 space-y-6">
          {/* User Profile Card */}
          <div className="bg-white/40 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/30 dark:border-gray-700/30">
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg bg-gradient-to-br",
                getRoleColor(user.role)
              )}>
                {getInitials(user.name || 'Usuario')}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {user.name || 'Sin nombre'}
                  </h3>
                  {user.role === 'ADMIN' && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                      <Crown className="w-3 h-3" />
                      Admin
                    </div>
                  )}
                  {user.banned && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
                      <Ban className="w-3 h-3" />
                      Baneado
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {user.email}
                  </span>
                  {user.emailVerified ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Registrado: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Fecha no disponible'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/40 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/30 dark:border-gray-700/30 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {user.emailVerified ? 'Verificado' : 'Sin verificar'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Estado del email</div>
            </div>
            
            <div className="bg-white/40 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/30 dark:border-gray-700/30 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white mb-1 capitalize">
                {user.role?.toLowerCase() || 'Usuario'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Rol del usuario</div>
            </div>
          </div>

          {/* Ban Information */}
          {user.banned && (
            <div className="bg-red-50/50 dark:bg-red-900/20 backdrop-blur-lg rounded-2xl p-6 border border-red-200/50 dark:border-red-700/50">
              <div className="flex items-center gap-2 mb-3">
                <Ban className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-lg font-bold text-red-700 dark:text-red-300">Usuario Baneado</span>
              </div>
              {user.banReason && (
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Razón: {user.banReason}
                </p>
              )}
              {user.banExpires && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Expira: {new Date(user.banExpires).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleRoleUpdate(user.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                disabled={isUpdating || (isFirstUser && user.role === 'ADMIN')}
                className={`rounded-xl py-3 font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 ${
                  isFirstUser && user.role === 'ADMIN'
                    ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500/90 hover:bg-blue-600 text-white'
                }`}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isFirstUser && user.role === 'ADMIN' ? 'Admin protegido' : (user.role === 'ADMIN' ? 'Quitar Admin' : 'Hacer Admin')}
              </Button>
              
              <Button
                onClick={handleToggleBan}
                disabled={isUpdating || isFirstUser}
                variant="outline"
                className={`rounded-xl py-3 font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 ${
                  isFirstUser
                    ? 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                    : 'border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                }`}
              >
                <Ban className="w-4 h-4 mr-2" />
                {isFirstUser ? 'Usuario protegido' : (user.banned ? 'Desbanear' : 'Banear')}
              </Button>
            </div>
            
            <Button
              onClick={handleDelete}
              disabled={isUpdating || isFirstUser}
              variant="outline"
              className={`w-full rounded-xl py-3 font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 ${
                isFirstUser 
                  ? 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-500 cursor-not-allowed' 
                  : 'border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
              }`}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isFirstUser ? 'Usuario protegido' : 'Eliminar Usuario'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}