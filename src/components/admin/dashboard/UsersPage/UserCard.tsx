'use client';

import { 
  MoreHorizontal,
  Crown,
  User,
  Edit,
  Calendar,
  Activity,
  Eye,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { User as UserType } from '@/types/user';

interface UserCardProps {
  user: UserType;
  index: number;
  onViewDetails: (user: UserType) => void;
}

export function UserCard({ user, index, onViewDetails }: UserCardProps) {
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
        return 'bg-blue-600';
      case 'editor':
        return 'bg-emerald-600';
      case 'user':
        return 'bg-gray-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return Crown;
      case 'editor':
        return Edit;
      default:
        return User;
    }
  };

  const RoleIcon = getRoleIcon(user.role);

  return (
    <div 
      className="group cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 hover:border-gray-300 dark:hover:border-gray-700">
        
        {/* Header with avatar and info */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold text-sm",
              getRoleColor(user.role)
            )}>
              {getInitials(user.name || 'Usuario')}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                  {user.name || 'Usuario sin nombre'}
                </h3>
                <div className={cn(
                  "w-5 h-5 rounded flex items-center justify-center",
                  getRoleColor(user.role)
                )}>
                  <RoleIcon className="w-3 h-3 text-white" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.email || 'Email no disponible'}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 p-0"
          >
            <MoreHorizontal className="h-4 w-4 text-gray-500" strokeWidth={1.5} />
          </Button>
        </div>

        {/* User info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <span className="text-sm text-gray-600 dark:text-gray-400">Rol</span>
            </div>
            <div className={cn(
              "px-2 py-1 rounded text-xs font-medium text-white",
              getRoleColor(user.role)
            )}>
              {user.role?.toUpperCase() || 'USER'}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <span className="text-sm text-gray-600 dark:text-gray-400">Registro</span>
            </div>
            <span className="text-sm text-gray-900 dark:text-gray-100">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) : 'N/A'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <span className="text-sm text-gray-600 dark:text-gray-400">Estado</span>
            </div>
            <div className={cn(
              "w-2 h-2 rounded-full",
              user.emailVerified ? 'bg-emerald-500' : 'bg-red-500'
            )} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button 
            onClick={() => onViewDetails(user)}
            className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-all duration-200"
          >
            <div className="flex items-center justify-center gap-2">
              <Eye className="h-4 w-4" strokeWidth={1.5} />
              <span>Ver perfil</span>
            </div>
          </button>
          
          <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200">
            <Mail className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
