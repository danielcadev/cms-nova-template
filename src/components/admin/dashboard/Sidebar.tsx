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
  Menu,
  Package,
  Plug,
  Plus,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo, useCallback, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  const { user, isLoading: userLoading } = useCurrentUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const userInitial = useMemo(() => {
    if (user?.name?.trim()) {
      return user.name.trim().charAt(0).toUpperCase()
    }
    if (user?.email?.trim()) {
      return user.email.trim().charAt(0).toUpperCase()
    }
    return 'A'
  }, [user])

  const userDisplayName = useMemo(() => {
    if (user?.name?.trim()) {
      return user.name.trim()
    }
    if (user?.email?.trim()) {
      return user.email.trim().split('@')[0]
    }
    return 'Administrator'
  }, [user])

  const userDisplayDetails = useMemo(() => {
    if (user?.email?.trim()) {
      return user.email.trim()
    }
    return 'administrator@workspace.app'
  }, [user])

  const MenuItem = useCallback(
    ({
      href,
      icon: Icon,
      label,
      description,
      isActive,
      hasSubmenu = false,
    }: NavigationItem & { isActive: boolean }) => {
      return (
        <Link
          href={href}
          className={cn(
            'group relative flex items-center justify-between gap-3 rounded-2xl border px-5 py-3 transition-all duration-200',
            isActive
              ? 'bg-[var(--theme-accent-light)]'
              : 'theme-card border-transparent hover:border-[var(--theme-border)] hover:theme-card-hover',
          )}
          style={
            isActive
              ? {
                  borderColor: 'var(--theme-accent)',
                  boxShadow: '0 18px 34px -22px var(--theme-accent)',
                }
              : undefined
          }
          onClick={() => {
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
              onClose()
              setMobileMenuOpen(false)
            }
          }}
        >
          {isActive && (
            <span className="absolute inset-y-2 left-1 w-1 rounded-full bg-[var(--theme-accent)]" />
          )}

          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200',
                isActive
                  ? 'border-transparent theme-accent-bg text-white shadow-ios'
                  : 'theme-bg border theme-border group-hover:border-transparent group-hover:theme-card-hover',
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 transition-colors duration-200',
                  isActive ? 'text-white' : 'theme-text-secondary group-hover:theme-text',
                )}
                strokeWidth={1.5}
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <span
                className={cn(
                  'text-sm font-semibold tracking-tight transition-colors duration-150',
                  isActive ? 'theme-text' : 'theme-text-secondary group-hover:theme-text',
                )}
                style={{ fontFeatureSettings: '"ss01" on, "ss02" on' }}
              >
                {label}
              </span>
              {description && (
                <span className="truncate text-xs transition-colors duration-150 theme-text-muted group-hover:theme-text-secondary">
                  {description}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {hasSubmenu && (
              <ChevronRight
                className="h-4 w-4 theme-text-muted transition-colors duration-150 group-hover:theme-text-secondary"
                strokeWidth={1.5}
              />
            )}
          </div>
        </Link>
      )
    },
    [onClose],
  )

  const navigationSections = useMemo<NavigationSection[]>(
    () => [
      {
        title: 'Main',
        items: [
          {
            href: '/admin/dashboard',
            icon: Home,
            label: 'Dashboard',
            description: 'Monitor key metrics and activity',
          },
        ],
      },
      {
        title: 'Management',
        items: [
          {
            href: '/admin/dashboard/users',
            icon: Users,
            label: 'Users',
            description: 'Manage roles, invitations, and access',
          },
          {
            href: '/admin/dashboard/templates',
            icon: Layout,
            label: 'Templates',
            description: 'Refine reusable layouts and patterns',
          },
          {
            href: '/admin/dashboard/content-types',
            icon: Database,
            label: 'Content Types',
            description: 'Design data models and fields',
          },
          {
            href: '/admin/dashboard/view-content',
            icon: FileText,
            label: 'View Content',
            description: 'Review drafts and published entries',
          },
        ],
      },
      {
        title: 'Assets',
        items: [
          {
            href: '/admin/dashboard/media',
            icon: ImageIcon,
            label: 'Media',
            description: 'Curate your asset library',
          },
        ],
      },
      {
        title: 'System',
        items: [
          {
            href: '/admin/dashboard/plugins',
            icon: Plug,
            label: 'Plugins',
            description: 'Integrate new capabilities',
          },
          {
            href: '/admin/dashboard/settings',
            icon: Settings,
            label: 'Settings',
            description: 'Adjust workspace preferences',
          },
        ],
      },
    ],
    [],
  )

  const quickActions = useMemo<NavigationItem[]>(
    () => [
      {
        href: '/admin/dashboard/view-content',
        icon: FileText,
        label: 'Create new entry',
        description: 'Spin up a fresh page or post',
      },
      {
        href: '/admin/dashboard/media',
        icon: ImageIcon,
        label: 'Upload media',
        description: 'Bring assets into the library',
      },
    ],
    [],
  )

  const QuickAction = useCallback(
    ({ href, icon: Icon, label, description }: NavigationItem) => (
      <Link
        key={href}
        href={href}
        className="group relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl border border-dashed border-[var(--theme-border)] px-4 py-3 transition-all duration-200 hover:border-[var(--theme-accent)] hover:shadow-lg"
        onClick={() => {
          if (typeof window !== 'undefined' && window.innerWidth < 768) {
            onClose()
            setMobileMenuOpen(false)
          }
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--theme-accent-light)] text-[var(--theme-accent)]">
            <Icon className="h-4 w-4" strokeWidth={1.5} />
          </div>

          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-semibold theme-text">{label}</span>
            {description && (
              <span className="truncate text-xs theme-text-secondary">{description}</span>
            )}
          </div>
        </div>

        <ChevronRight
          className="h-4 w-4 theme-text-muted transition-transform duration-200 group-hover:translate-x-1"
          strokeWidth={1.5}
        />
      </Link>
    ),
    [onClose],
  )

  const filteredSections = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()
    if (!normalizedTerm) {
      return navigationSections
    }

    return navigationSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          const haystack = `${item.label} ${item.description ?? ''}`.toLowerCase()
          return haystack.includes(normalizedTerm)
        }),
      }))
      .filter((section) => section.items.length > 0)
  }, [navigationSections, searchTerm])

  const handleLogoutClick = async () => {
    try {
      await handleLogout()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <>
      {/* Mobile menu button - visible only on mobile */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMobileMenu}
          className="h-10 w-10 rounded-lg theme-card border theme-border shadow-sm"
        >
          <Menu className="h-5 w-5 theme-text" strokeWidth={1.5} />
        </Button>
      </div>

      {/* Enhanced Mobile Overlay */}
      {(isOpen || mobileMenuOpen) && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md md:hidden animate-fade-in"
          onClick={() => {
            onClose()
            setMobileMenuOpen(false)
          }}
          aria-label="Close sidebar"
        />
      )}

      {/* Notion-style Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-80 transform flex-col transition-all duration-200 ease-out',
          'theme-bg-secondary theme-border-r',
          'shadow-sm',
          isOpen || mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0 md:static md:inset-0',
        )}
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* Header (revamped) */}
        <div className="relative p-4 theme-border-b">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 group"
              onClick={() => {
                onClose()
                setMobileMenuOpen(false)
              }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl theme-card border theme-border">
                <Package className="h-5 w-5 theme-text" strokeWidth={1.75} />
              </div>
              <div className="flex flex-col min-w-0">
                <h1 className="text-lg font-semibold theme-text tracking-tight">Nova CMS</h1>
                <p className="text-xs theme-text-secondary">Workspace</p>
              </div>
            </Link>

            <Button asChild size="sm" className="hidden h-9 rounded-lg px-3 md:inline-flex">
              <Link
                href="/admin/dashboard/view-content"
                onClick={() => {
                  onClose()
                  setMobileMenuOpen(false)
                }}
              >
                <Plus className="h-4 w-4" strokeWidth={1.5} />
                New entry
              </Link>
            </Button>
          </div>

          <div className="mt-4 hidden md:flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-[var(--theme-border)] px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-[var(--theme-text-secondary)]">
              <Sparkles className="h-3 w-3 text-[var(--theme-accent)]" strokeWidth={1.5} />
              <span>Creative workspace</span>
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onClose()
              setMobileMenuOpen(false)
            }}
            className="md:hidden h-8 w-8 rounded-lg hover:theme-card-hover transition-all duration-200 absolute right-3 top-3"
          >
            <X className="h-4 w-4 theme-text-secondary" strokeWidth={1.5} />
          </Button>
        </div>

        {/* Navigation (revamped) */}
        <nav className="relative flex-1 overflow-y-auto px-4 py-6">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-64 rounded-b-[32px] opacity-70 blur-2xl"
            style={{
              background:
                'radial-gradient(120% 120% at 0% 0%, rgba(59,130,246,0.18), transparent 70%)',
            }}
          />

          <div className="relative space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--theme-text-muted)]">
                  Navigator
                </span>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="text-[11px] font-medium text-[var(--theme-accent)] hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-text-muted)]"
                  strokeWidth={1.5}
                />
                <Input
                  type="search"
                  inputMode="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search menu..."
                  className="h-10 rounded-xl border border-transparent bg-[var(--theme-card)] pl-9 text-sm theme-text placeholder:text-[var(--theme-text-secondary)] placeholder:opacity-70 shadow-none focus:border-[var(--theme-border)] focus:shadow-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)] focus-visible:ring-opacity-40"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--theme-text-muted)]">
                  Account
                </span>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-4">
                <div className="pointer-events-none absolute inset-0 opacity-80">
                  <div className="h-full w-full bg-[radial-gradient(120%_120%_at_0%_0%,rgba(59,130,246,0.18),transparent_70%)]" />
                </div>

                <div className="relative flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--theme-border)] bg-[var(--theme-accent)]/15 text-[var(--theme-accent)]">
                    {userLoading ? (
                      <div className="h-4 w-4 animate-pulse rounded-lg bg-[var(--theme-accent)]/40" />
                    ) : (
                      <span className="text-sm font-semibold">{userInitial}</span>
                    )}
                  </div>

                  <div className="relative min-w-0 flex-1">
                    {userLoading ? (
                      <div className="space-y-1">
                        <div className="h-3 w-24 animate-pulse rounded bg-[var(--theme-bg-secondary)]" />
                        <div className="h-2 w-28 animate-pulse rounded bg-[var(--theme-bg-secondary)]" />
                      </div>
                    ) : (
                      <>
                        <p className="truncate text-sm font-semibold leading-tight theme-text">
                          {userDisplayName}
                        </p>
                        <p className="truncate text-xs theme-text-secondary">
                          {userDisplayDetails}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleLogoutClick}
                  variant="ghost"
                  size="sm"
                  className="relative mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-[var(--theme-accent)]/15 py-2 text-sm font-semibold text-[var(--theme-accent)] transition-all duration-200 hover:bg-[var(--theme-accent)]/25"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.5} />
                  Sign out
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--theme-text-muted)]">
                  Quick actions
                </span>
              </div>
              <div className="space-y-2">{quickActions.map((action) => QuickAction(action))}</div>
            </div>

            <div className="space-y-6">
              {filteredSections.length > 0 ? (
                filteredSections.map((section) => (
                  <div key={section.title} className="space-y-2">
                    <div className="flex items-center gap-2 px-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--theme-accent)] opacity-70" />
                      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--theme-text-muted)]">
                        {section.title}
                      </h3>
                    </div>

                    <div className="space-y-2">
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
                            description={item.description}
                            isActive={isActive}
                          />
                        )
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--theme-border)] px-6 py-8 text-center">
                  <p className="text-sm font-semibold theme-text">No matches found</p>
                  <p className="mt-1 text-xs theme-text-secondary">
                    Try a different keyword to locate a section.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mx-auto mt-4 h-8"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <div className="p-4 theme-border-t text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--theme-text-muted)]">
          Nova CMS — Admin workspace
        </div>
      </aside>
    </>
  )
}

export const Sidebar = memo(SidebarComponent)
