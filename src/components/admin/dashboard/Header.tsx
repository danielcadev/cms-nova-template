// components/admin/dashboard/Header.tsx - Modern Glassmorphism Design
'use client';

import { useRouter } from 'next/navigation';
import { Menu, Search, LogOut, Settings, User as UserIcon, Bell, Plus, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const router = useRouter();
  const { handleLogout } = useAuth();
  const { user } = useCurrentUser();
  const userName = user?.name || 'Administrador';
  
  const getInitials = () => {
    if (!userName) return 'A';
    return userName
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const onLogout = async () => {
    await handleLogout();
    router.push('/admin/login');
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-700/30 px-6 shadow-lg">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden w-10 h-10 rounded-xl bg-gray-100/80 dark:bg-gray-800/50 hover:bg-gray-200/80 dark:hover:bg-gray-700/50 transition-all duration-300 hover:scale-105"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 rounded-2xl hover:bg-white/60 dark:hover:bg-white/5 hover:backdrop-blur-xl hover:shadow-md transition-all duration-300 pl-2 pr-4 h-10 group"
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 group-hover:shadow-xl group-hover:shadow-emerald-500/40 transition-all duration-300">
                <span className="text-xs font-bold">{getInitials()}</span>
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full" />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white hidden sm:inline-block group-hover:translate-x-0.5 transition-transform duration-300">{userName}</span>
              <span className="sr-only">Perfil</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-72 p-4 mt-2 bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 animate-in slide-in-from-top-2"
          >
            {/* User Info Header */}
            <div className="p-4 mb-4 bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
                  <span className="text-sm font-bold">{getInitials()}</span>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{userName}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                    Administrador
                    <Crown className="h-3 w-3 text-amber-500" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Menu Items */}
            <div className="space-y-1.5">
              <DropdownMenuItem 
                className="flex items-center gap-3.5 rounded-2xl p-3.5 text-sm font-medium cursor-pointer hover:bg-white/60 dark:hover:bg-white/5 hover:backdrop-blur-xl hover:shadow-md hover:text-gray-900 dark:hover:text-white transition-all duration-300 group" 
                onClick={() => router.push('/admin/perfil')}
              >
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100/80 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200/80 dark:group-hover:bg-gray-700/50 group-hover:scale-105 transition-all duration-300">
                  <UserIcon className="h-4 w-4 group-hover:h-4.5 group-hover:w-4.5 transition-all duration-300" />
                </div>
                <span className="group-hover:translate-x-0.5 transition-transform duration-300">Mi perfil</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                className="flex items-center gap-3.5 rounded-2xl p-3.5 text-sm font-medium cursor-pointer hover:bg-white/60 dark:hover:bg-white/5 hover:backdrop-blur-xl hover:shadow-md hover:text-gray-900 dark:hover:text-white transition-all duration-300 group" 
                onClick={() => router.push('/admin/configuracion')}
              >
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100/80 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200/80 dark:group-hover:bg-gray-700/50 group-hover:scale-105 transition-all duration-300">
                  <Settings className="h-4 w-4 group-hover:h-4.5 group-hover:w-4.5 transition-all duration-300" />
                </div>
                <span className="group-hover:translate-x-0.5 transition-transform duration-300">Configuración</span>
              </DropdownMenuItem>
              
              <div className="my-3 h-px bg-gray-200/50 dark:bg-gray-700/50" />
              
              <DropdownMenuItem 
                className="flex items-center gap-3.5 rounded-2xl p-3.5 text-sm font-medium cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 group hover:shadow-lg hover:shadow-red-500/10"
                onClick={onLogout}
              >
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 group-hover:scale-105 transition-all duration-300">
                  <LogOut className="h-4 w-4 group-hover:h-4.5 group-hover:w-4.5 transition-all duration-300" />
                </div>
                <span className="group-hover:translate-x-0.5 transition-transform duration-300">Cerrar sesión</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}