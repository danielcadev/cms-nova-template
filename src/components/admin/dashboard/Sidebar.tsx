// components/admin/dashboard/Sidebar.tsx - Modern Editorial Design
'use client'

import {
  Database,
  FileText,
  Home,
  Image as ImageIcon,
  LogOut,
  Menu,
  Package,
  Plug,
  Settings,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo, useCallback, useMemo, useState } from 'react'
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

interface NavigationItem {
  href: AdminRoute
  icon: React.ElementType
  label: string
  description?: string
  hasSubmenu?: boolean
}

interface NavigationSection {
  title: string
  items: NavigationItem[]
}

function SidebarComponent({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { handleLogout } = useAuth()
  const { user } = useCurrentUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const userInitial = useMemo(() => {
    if (user?.name?.trim()) {
      return user.name.trim().charAt(0).toUpperCase()
    }
    if (user?.email?.trim()) {
      return user.email.trim().charAt(0).toUpperCase()
    }
    return 'A'
  }, [user])

  const MenuItem = useCallback(
    ({ href, icon: Icon, label, isActive }: NavigationItem & { isActive: boolean }) => {
      return (
        <Link
          href={href}
          className={cn(
            'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300',
            isActive
              ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/20 scale-105'
              : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 hover:scale-105',
          )}
          onClick={() => {
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
              onClose()
              setMobileMenuOpen(false)
            }
          }}
        >
          <Icon
            className={cn(
              'h-5 w-5 transition-transform duration-300 group-hover:rotate-3',
              isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-900',
            )}
            strokeWidth={isActive ? 2 : 1.5}
          />
          <span
            className={cn('text-sm font-medium tracking-wide', isActive ? 'font-semibold' : '')}
          >
            {label}
          </span>

          {isActive && (
            <div className="absolute right-2 h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          )}
        </Link>
      )
    },
    [onClose],
  )

  const navigationSections = useMemo<NavigationSection[]>(
    () => [
      {
        title: 'Overview',
        items: [
          { href: '/admin/dashboard', icon: Home, label: 'Home' },
          { href: '/admin/dashboard/view-content', icon: FileText, label: 'Content' },
          { href: '/admin/dashboard/media', icon: ImageIcon, label: 'Media' },
        ],
      },
      {
        title: 'Manage',
        items: [
          { href: '/admin/dashboard/users', icon: Users, label: 'Team' },
          { href: '/admin/dashboard/content-types', icon: Database, label: 'Models' },
        ],
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Button
          type="button"
          variant="default"
          size="icon"
          onClick={toggleMobileMenu}
          className="h-14 w-14 rounded-full bg-zinc-900 text-white shadow-2xl shadow-zinc-900/30 hover:bg-zinc-800 hover:scale-105 transition-all"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Backdrop */}
      {(isOpen || mobileMenuOpen) && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-white/80 backdrop-blur-md md:hidden transition-all duration-500"
          onClick={() => {
            onClose()
            setMobileMenuOpen(false)
          }}
          aria-label="Close menu"
        />
      )}

      {/* Floating Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col transition-all duration-500 cubic-bezier(0.32, 0.72, 0, 1)',
          isOpen || mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0',
          'md:translate-x-0 md:opacity-100 md:static',
          // Floating styles
          'md:h-[calc(100vh-2rem)] md:my-4 md:ml-4 rounded-3xl',
          'bg-white/90 backdrop-blur-2xl shadow-2xl shadow-zinc-200/50 border border-white/20',
        )}
      >
        {/* Header */}
        <div className="flex h-24 items-center px-8">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 group"
            onClick={() => {
              onClose()
              setMobileMenuOpen(false)
            }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 text-white shadow-lg shadow-zinc-900/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              <Package className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <span className="block text-base font-bold text-zinc-900 tracking-tight leading-none">
                NOVA
              </span>
              <span className="block text-[10px] font-medium text-zinc-400 tracking-widest uppercase mt-0.5">
                Workspace
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-6 space-y-8 scrollbar-none py-4">
          {navigationSections.map((section) => (
            <div key={section.title} className="space-y-2">
              <h3 className="px-3 text-[11px] font-bold uppercase tracking-widest text-zinc-300 mb-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive =
                    item.href === '/admin/dashboard'
                      ? pathname === item.href
                      : pathname.startsWith(item.href)
                  return (
                    <MenuItem
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                      isActive={isActive}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-6">
          <div className="group relative flex items-center gap-4 rounded-2xl bg-zinc-50 p-4 transition-all duration-300 hover:bg-zinc-100 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-900 font-bold shadow-sm border border-zinc-100">
              {userInitial}
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-sm font-bold text-zinc-900">Admin</span>
              <span className="truncate text-[10px] font-medium text-zinc-400">View Profile</span>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-8 w-8 rounded-lg text-zinc-400 hover:bg-white hover:text-red-500 hover:shadow-sm transition-all"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

export const Sidebar = memo(SidebarComponent)
