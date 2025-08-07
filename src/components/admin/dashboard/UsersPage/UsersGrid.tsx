'use client';

import { Users, UserPlus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { User as UserType } from '@/types/user';
import { UserCard } from './UserCard';

interface UsersGridProps {
  users: UserType[];
  loading: boolean;
  error: any;
  onViewDetails: (user: UserType) => void;
}

export function UsersGrid({ users, loading, error, onViewDetails }: UsersGridProps) {
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  if (users.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {users.map((user, index) => (
        <UserCard 
          key={user.id} 
          user={user} 
          index={index} 
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState() {
  return (
    <div className="text-center py-20 px-4">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-6">
          <Users className="w-8 h-8 text-red-600 dark:text-red-400" strokeWidth={1.5} />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
          Error al cargar usuarios
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          No se pudieron cargar los usuarios. Verifica tu conexión e intenta nuevamente.
        </p>
        
        <button className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
          Reintentar
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 px-4">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-6">
          <Users className="w-8 h-8 text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
          No hay usuarios
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Aún no hay usuarios registrados en el sistema. Los usuarios aparecerán aquí cuando se registren.
        </p>
        
        <button className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" strokeWidth={1.5} />
            <span>Invitar usuario</span>
          </div>
        </button>
      </div>
    </div>
  );
}