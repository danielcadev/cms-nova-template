// components/admin/dashboard/Sidebar.tsx - Modern Editorial Design
'use client'

import {
  ChevronRight,
  Database,
  FileText,
  Home,
  Image as ImageIcon,
  Layout,
  LogOut,
  Package,
  Plug,
  Settings,
  Users,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useCurrentUser } from '@/hooks/use-current-user'
import { cn } from '@/lib/utils'

type AdminRoute = string

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onToggle?: () => void
}

function SidebarComponent({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { handleLogout } = useAuth()
  const { user, isLoading: userLoading } = useCurrentUser()

  const MenuItem = useCallback(
    ({
      href,
      icon: Icon,
      label,
      isActive,
      hasSubmenu = false,
    }: {
      href: AdminRoute
      icon: React.ElementType
      label: string
      isActive: boolean
      hasSubmenu?: boolean
      index?: number
    }) => {
      // Debug removed to avoid noisy console output in production
      // if (process.env.NODE_ENV !== 'production') {
      //   try { console.debug('[Sidebar.MenuItem]', { href, label, isActive }); } catch {}
      // }
      return (
        <Link
          href={href}
          className={cn(
            'group relative flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 ease-out border',
            isActive
              ? 'theme-card border theme-border-light theme-text'
              : 'border-transparent theme-text-secondary hover:theme-card-hover hover:border theme-border-light hover:theme-text',
          )}
          onClick={() => {
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
              onClose()
            }
          }}
        >
          {/* Active indicator bar */}
          <span
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full theme-accent-bg transition-opacity',
              isActive ? 'opacity-100' : 'opacity-0',
            )}
          />

          <div className="flex items-center gap-3">
            <Icon
              className={cn(
                'transition-colors duration-200',
                isActive
                  ? 'h-5 w-5 theme-text'
                  : 'h-5 w-5 theme-text-secondary group-hover:theme-text',
              )}
              strokeWidth={1.25}
            />

            <span
              className={cn(
                'flex-1 text-[15px] font-medium transition-colors duration-200',
                isActive ? 'theme-text' : 'theme-text-secondary group-hover:theme-text',
              )}
              style={{ letterSpacing: '0.1px' }}
            >
              {label}
            </span>
          </div>

          <div className="flex items-center">
            {hasSubmenu && (
              <ChevronRight
                className={cn(
                  'h-3 w-3 transition-colors duration-200',
                  isActive ? 'theme-text-secondary' : 'theme-text-secondary group-hover:theme-text',
                )}
                strokeWidth={1.5}
              />
            )}
            {isActive && !hasSubmenu && <div className="w-1 h-1 rounded-full theme-accent-bg" />}
          </div>
        </Link>
      )
    },
    [onClose],
  )

  const navigationSections = useMemo(
    () => [
      {
        title: 'Main',
        items: [{ href: '/admin/dashboard', icon: Home, label: 'Dashboard' }],
      },
      {
        title: 'Management',
        items: [
          { href: '/admin/dashboard/users', icon: Users, label: 'Users' },
          { href: '/admin/dashboard/templates', icon: Layout, label: 'Templates' },
          { href: '/admin/dashboard/content-types', icon: Database, label: 'Content Types' },
          { href: '/admin/dashboard/view-content', icon: FileText, label: 'View Content' },
        ],
      },
      {
        title: 'Assets',
        items: [{ href: '/admin/dashboard/media', icon: ImageIcon, label: 'Media' }],
      },
      {
        title: 'System',
        items: [
          { href: '/admin/dashboard/plugins', icon: Plug, label: 'Plugins' },
          { href: '/admin/dashboard/settings', icon: Settings, label: 'Settings' },
        ],
      },
    ],
    [],
  )

  const handleLogoutClick = async () => {
    try {
      await handleLogout()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <>
      {/* Enhanced Mobile Overlay */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md md:hidden animate-fade-in"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      {/* Editorial Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 transform transition-all duration-300 ease-out',
          'theme-card border theme-border',
          'shadow-sm',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0 md:static md:inset-0',
        )}
      >
        {/* Header */}
        <div className="relative p-6 border-b theme-border">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border theme-border theme-card shadow-sm">
              <Package className="h-4 w-4 theme-text" strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-semibold theme-text tracking-tight">Nova CMS</h1>
              <p className="text-xs theme-text-secondary">Admin</p>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="md:hidden h-8 w-8 rounded-lg hover:theme-card-hover transition-all duration-200 absolute right-6 top-6"
          >
            <X className="h-4 w-4 theme-text-secondary" strokeWidth={1.5} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {navigationSections.map((section, _sectionIndex) => (
            <div key={section.title} className="space-y-2">
              {/* Editorial Section Header */}
              <div className="px-2 py-1">
                <h3 className="text-xs font-semibold theme-text-secondary uppercase tracking-wide border-b border-transparent">
                  {section.title}
                </h3>
              </div>

              {/* Editorial Section Items */}
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const isActive = pathname === item.href
                  return (
                    <MenuItem
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                      isActive={isActive}
                      index={itemIndex}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="relative p-4 border-t theme-border-light">
          <div className="flex items-center gap-3 p-3 mb-3 theme-card rounded-lg border theme-border">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg theme-accent-bg text-white">
              <Users className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              {userLoading ? (
                <div className="animate-pulse space-y-1">
                  <div className="h-3 theme-bg-tertiary rounded w-20"></div>
                  <div className="h-2 theme-bg-tertiary rounded w-16"></div>
                </div>
              ) : (
                <>
                  <span className="text-sm font-medium theme-text truncate">
                    {user?.name || 'Administrator'}
                  </span>
                  <span className="text-xs theme-text-secondary">Administrator</span>
                </>
              )}
            </div>
          </div>

          {/* Editorial Logout Button */}
          <Button
            onClick={handleLogoutClick}
            variant="ghost"
            className="w-full theme-text hover:theme-card-hover rounded-lg py-2 text-sm font-medium transition-all duration-200 justify-start"
          >
            <LogOut className="h-4 w-4 mr-2 theme-text" strokeWidth={1.5} />
            Sign out
          </Button>
        </div>
      </aside>
    </>
  )
}

export const Sidebar = memo(SidebarComponent)
