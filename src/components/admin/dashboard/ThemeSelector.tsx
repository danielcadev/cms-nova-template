'use client'

import { Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/contexts/ThemeContext'

export function ThemeSelector() {
  const { theme, setTheme, themes } = useTheme()
  const _currentTheme = themes.find((t) => t.id === theme)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Change theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.id}
            onClick={() => setTheme(themeOption.id)}
            className="flex items-center space-x-2"
          >
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{
                background: `linear-gradient(135deg, ${themeOption.colors.primary} 0%, ${themeOption.colors.secondary} 100%)`,
              }}
            />
            <span>{themeOption.name}</span>
            {theme === themeOption.id && (
              <div className="ml-auto">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              </div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
