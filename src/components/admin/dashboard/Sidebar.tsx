// components/admin/dashboard/Sidebar.tsx - Modern Editorial Design
'use client';

import { useCallback, useMemo, useState, memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  Settings, 
  X,
  Package,
  PlusCircle,
  Layout,
  LogOut,
  Plug,
  Database,
  FileText,
  ChevronRight,
  Sparkles,
  Circle,
  Dot,
  Crown,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useCurrentUser } from '@/hooks/use-current-user';

type AdminRoute = string;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle?: () => void;
}

function SidebarComponent({ isOpen, onClose, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { handleLogout } = useAuth();
  const { user, isLoading: userLoading } = useCurrentUser();

  const MenuItem = useCallback(({ 
    href, 
    icon: Icon, 
    label,
    isActive,
    hasSubmenu = false,
    index = 0
  }: { 
    href: AdminRoute; 
    icon: React.ElementType; 
    label: string;
    isActive: boolean;
    hasSubmenu?: boolean;
    index?: number;
  }) => {
    return (
      <Link 
        href={href} 
        className={cn(
          "group relative flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ease-out",
          isActive 
            ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium" 
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100"
        )}
        onClick={() => {
          if (typeof window !== 'undefined' && window.innerWidth < 768) {
            onClose();
          }
        }}
      >
        <div className="flex items-center gap-3">
          {/* Editorial Icon */}
          <Icon className={cn(
            "transition-all duration-200",
            isActive 
              ? "h-4 w-4 text-gray-900 dark:text-gray-100" 
              : "h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
          )} strokeWidth={1.5} />
          
          <span className={cn(
            "flex-1 text-sm font-medium transition-all duration-200",
            isActive 
              ? "text-gray-900 dark:text-gray-100" 
              : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100"
          )}>
            {label}
          </span>
        </div>
        
        {/* Editorial Navigation Indicators */}
        <div className="flex items-center">
          {hasSubmenu && (
            <ChevronRight className={cn(
              "h-3 w-3 transition-all duration-200",
              isActive 
                ? "text-gray-700 dark:text-gray-300" 
                : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400"
            )} strokeWidth={1.5} />
          )}
          {isActive && !hasSubmenu && (
            <div className="w-1 h-1 rounded-full bg-gray-900 dark:bg-gray-100" />
          )}
        </div>
      </Link>
    );
  }, [pathname, onClose]);

  const navigationSections = useMemo(() => [
    {
      title: "Principal",
      items: [
        { href: '/admin/dashboard', icon: Home, label: 'Dashboard' }
      ]
    },
    {
      title: "Gestión",
      items: [
        { href: '/admin/dashboard/users', icon: Users, label: 'Usuarios' },
        { href: '/admin/dashboard/templates', icon: Layout, label: 'Plantillas' },
        { href: '/admin/dashboard/content-types', icon: Database, label: 'Tipos de Contenido' },
        { href: '/admin/dashboard/view-content', icon: FileText, label: 'Ver Contenido' }
      ]
    },
    {
      title: "Sistema",
      items: [
        { href: '/admin/dashboard/plugins', icon: Plug, label: 'Plugins' },
        { href: '/admin/dashboard/settings', icon: Settings, label: 'Configuración' }
      ]
    }
  ], []);

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      {/* Enhanced Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md md:hidden animate-fade-in"
          onClick={onClose}
        />
      )}
      
      {/* Editorial Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transform transition-all duration-300 ease-out",
        "bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800",
        "shadow-sm",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0 md:static md:inset-0"
      )}>
        {/* Clean Editorial Background */}
        <div className="absolute inset-0 bg-gray-50/50 dark:bg-gray-900/50" />
        
        {/* Editorial Header */}
        <div className="relative flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 transition-all duration-200">
              <Package className="h-4 w-4" strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                Nova CMS
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Editorial Design
              </p>
            </div>
          </Link>
          
          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="md:hidden h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
          </Button>
        </div>
        
        {/* Editorial Navigation */}
        <nav className="relative flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {navigationSections.map((section, sectionIndex) => (
            <div key={section.title} className="space-y-2">
              {/* Editorial Section Header */}
              <div className="px-2 py-1">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {section.title}
                </h3>
              </div>
              
              {/* Editorial Section Items */}
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const isActive = pathname === item.href;
                  return (
                    <MenuItem 
                      key={item.href}
                      href={item.href} 
                      icon={item.icon} 
                      label={item.label}
                      isActive={isActive}
                      index={itemIndex}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        
        {/* Editorial Footer */}
        <div className="relative p-4 border-t border-gray-200 dark:border-gray-800">
          {/* Editorial User Info */}
          <div className="flex items-center gap-3 p-3 mb-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
              <Users className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              {userLoading ? (
                <div className="animate-pulse space-y-1">
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              ) : (
                <>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {user?.name || 'Administrador'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Administrador</span>
                </>
              )}
            </div>
          </div>
          
          {/* Editorial Logout Button */}
          <Button 
            onClick={handleLogoutClick}
            variant="ghost" 
            className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg py-2 text-sm font-medium transition-all duration-200 justify-start"
          >
            <LogOut className="h-4 w-4 mr-2" strokeWidth={1.5} />
            Cerrar sesión
          </Button>
        </div>
      </aside>
    </>
  );
}

export const Sidebar = memo(SidebarComponent);