'use client'

import { Mail, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

interface InviteUserModalProps {
    isOpen: boolean
    onClose: () => void
    onInviteSuccess: () => void
}

export function InviteUserModal({ isOpen, onClose, onInviteSuccess }: InviteUserModalProps) {
    const t = useTranslations('users.createModal')
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email.trim() || !password.trim()) {
            toast({
                variant: 'destructive',
                title: t('requiredFields'),
                description: t('requiredFieldsDesc'),
            })
            return
        }

        if (password !== confirmPassword) {
            toast({
                variant: 'destructive',
                title: t('passMismatchTitle'),
                description: t('passMismatchDesc'),
            })
            return
        }

        if (password.length < 8) {
            toast({
                variant: 'destructive',
                title: t('passShortTitle'),
                description: t('passShortDesc'),
            })
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim(),
                    name: name.trim() || undefined,
                    password: password,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create user')
            }

            toast({
                title: t('successTitle'),
                description: t('successDesc', { email }),
            })

            setEmail('')
            setName('')
            setPassword('')
            setConfirmPassword('')
            onClose()
            onInviteSuccess()
        } catch (error) {
            toast({
                variant: 'destructive',
                title: t('errorTitle'),
                description: error instanceof Error ? error.message : 'Unknown error',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md animate-in zoom-in-95 fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50/50">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-zinc-900">{t('title')}</h2>
                                <p className="text-xs text-zinc-500">{t('subtitle')}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-zinc-400 hover:text-zinc-600 transition-colors rounded-full p-1 hover:bg-zinc-100"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="user-email" className="text-sm font-medium text-zinc-700">
                                {t('email')}
                            </Label>
                            <Input
                                id="user-email"
                                type="email"
                                placeholder="user@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-10 rounded-lg border-zinc-200 focus:border-zinc-300 focus:ring-0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="user-name" className="text-sm font-medium text-zinc-700">
                                {t('name')}
                            </Label>
                            <Input
                                id="user-name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-10 rounded-lg border-zinc-200 focus:border-zinc-300 focus:ring-0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="user-password" className="text-sm font-medium text-zinc-700">
                                {t('password')}
                            </Label>
                            <Input
                                id="user-password"
                                type="password"
                                placeholder={t('passwordHint')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                className="h-10 rounded-lg border-zinc-200 focus:border-zinc-300 focus:ring-0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="user-confirm-password" className="text-sm font-medium text-zinc-700">
                                {t('confirmPassword')}
                            </Label>
                            <Input
                                id="user-confirm-password"
                                type="password"
                                placeholder={t('confirmPlaceholder')}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                                className="h-10 rounded-lg border-zinc-200 focus:border-zinc-300 focus:ring-0"
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 h-10 rounded-lg border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                            >
                                {t('cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 h-10 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800"
                            >
                                {loading ? t('submitting') : t('submit')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
