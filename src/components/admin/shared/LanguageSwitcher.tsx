'use client'

import { Globe } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { setUserLocale } from '@/lib/i18n-utils'

export function LanguageSwitcher() {
    const locale = useLocale()

    const languages = [
        { code: 'es', name: 'Español' },
        { code: 'en', name: 'English' },
    ]

    const currentLanguage = languages.find((l) => l.code === locale) || languages[0]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 text-zinc-500 hover:text-zinc-900 transition-colors gap-2 rounded-xl"
                >
                    <Globe className="h-4 w-4" strokeWidth={2} />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                        {currentLanguage.code}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 rounded-xl p-1 border-zinc-200">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setUserLocale(lang.code)}
                        className={`rounded-lg cursor-pointer text-xs font-medium py-2 ${locale === lang.code ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500'
                            }`}
                    >
                        {lang.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
