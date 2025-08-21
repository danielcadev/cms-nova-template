// components/admin/dashboard/Header.tsx - Modern Glassmorphism Design
'use client'

import { Crown, LogOut, Menu, Settings, User as UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthContext } from '@/contexts/AuthContext'
import { useCurrentUser } from '@/hooks/use-current-user'
import { ThemeSelector } from './ThemeSelector'

interface HeaderProps {
  onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  const router = useRouter()
  const { handleLogout } = useAuthContext()
  const { user } = useCurrentUser()
  const userName = user?.name || 'Administrador'

  const getInitials = () => {
    if (!userName) return 'A'
    return userName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const onLogout = async () => {
    await handleLogout()
    router.push('/admin/login')
  }

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between theme-card backdrop-blur-xl border-b theme-border px-6 shadow-lg">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden w-10 h-10 rounded-xl theme-bg-tertiary hover:theme-bg-secondary transition-all duration-300 hover:scale-105"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5 theme-text-secondary" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Theme Selector */}
        <ThemeSelector />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 rounded-2xl hover:theme-card-hover hover:backdrop-blur-xl hover:shadow-md transition-all duration-300 pl-2 pr-4 h-10 group"
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 group-hover:shadow-xl group-hover:shadow-emerald-500/40 transition-all duration-300">
                <span className="text-xs font-bold">{getInitials()}</span>
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 border-2 theme-border rounded-full" />
              </div>
              <span className="text-sm font-semibold theme-text hidden sm:inline-block group-hover:translate-x-0.5 transition-transform duration-300">
                {userName}
              </span>
              <span className="sr-only">Perfil</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-72 p-4 mt-2 theme-card backdrop-blur-xl rounded-2xl shadow-xl theme-border animate-in slide-in-from-top-2"
          >
            {/* User Info Header */}
            <div className="p-4 mb-4 theme-card backdrop-blur-xl rounded-2xl theme-border shadow-lg">
              <div className="flex items-center gap-4">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
                  <span className="text-sm font-bold">{getInitials()}</span>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 border-2 theme-border rounded-full" />
                </div>
                <div>
                  <div className="text-sm font-semibold theme-text">{userName}</div>
                  <div className="text-xs theme-text-secondary flex items-center gap-1.5">
                    Administrador
                    <Crown className="h-3 w-3 text-amber-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-1.5">
              <DropdownMenuItem
                className="flex items-center gap-3.5 rounded-2xl p-3.5 text-sm font-medium cursor-pointer hover:theme-card-hover hover:backdrop-blur-xl hover:shadow-md hover:theme-text transition-all duration-300 group"
                onClick={() => router.push('/admin/perfil')}
              >
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl theme-bg-tertiary theme-text-secondary group-hover:theme-bg-secondary group-hover:scale-105 transition-all duration-300">
                  <UserIcon className="h-4 w-4 group-hover:h-4.5 group-hover:w-4.5 transition-all duration-300" />
                </div>
                <span className="group-hover:translate-x-0.5 transition-transform duration-300">
                  Mi perfil
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center gap-3.5 rounded-2xl p-3.5 text-sm font-medium cursor-pointer hover:theme-card-hover hover:backdrop-blur-xl hover:shadow-md hover:theme-text transition-all duration-300 group"
                onClick={() => router.push('/admin/configuracion')}
              >
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl theme-bg-tertiary theme-text-secondary group-hover:theme-bg-secondary group-hover:scale-105 transition-all duration-300">
                  <Settings className="h-4 w-4 group-hover:h-4.5 group-hover:w-4.5 transition-all duration-300" />
                </div>
                <span className="group-hover:translate-x-0.5 transition-transform duration-300">
                  Configuración
                </span>
              </DropdownMenuItem>

              <div className="my-3 h-px theme-border" />

              <DropdownMenuItem
                className="flex items-center gap-3.5 rounded-2xl p-3.5 text-sm font-medium cursor-pointer theme-text hover:theme-card-hover transition-all duration-300 group"
                onClick={onLogout}
              >
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl theme-bg-tertiary theme-text-secondary group-hover:theme-bg-secondary group-hover:scale-105 transition-all duration-300">
                  <LogOut className="h-4 w-4 group-hover:h-4.5 group-hover:w-4.5 transition-all duration-300" />
                </div>
                <span className="group-hover:translate-x-0.5 transition-transform duration-300">
                  Cerrar sesión
                </span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
