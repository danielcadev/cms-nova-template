'use client'

import { Filter, Search, UserPlus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface UsersHeaderProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

export function UsersHeader({ searchTerm, onSearchChange }: UsersHeaderProps) {
  const t = useTranslations('users')
  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{t('title')}</h1>
          <p className="text-sm text-zinc-500 mt-1">{t('subtitle')}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-9 rounded-lg border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 text-sm"
          >
            <Filter className="w-4 h-4 mr-2" />
            {t('filters')}
          </Button>
          <Button className="h-9 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm text-sm">
            <UserPlus className="w-4 h-4 mr-2" />
            {t('inviteUser')}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-zinc-400" />
        </div>
        <Input
          type="search"
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-10 rounded-lg border-zinc-200 bg-white shadow-sm focus:border-zinc-300 focus:ring-0 transition-all placeholder:text-zinc-400 text-sm"
        />
      </div>
    </div>
  )
}
