'use client'

import { X } from 'lucide-react'
import { type PropsWithChildren, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    subtitle?: string
    icon?: React.ReactNode
    size?: 'sm' | 'md' | 'lg'
}

// Lightweight modal with focus handling and subtle animations
export function ModalBase({ isOpen, onClose, children }: PropsWithChildren<ModalProps>) {
    useEffect(() => {
        if (!isOpen) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', onKey)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return createPortal(
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <button
                type="button"
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') onClose()
                }}
                aria-label="Close modal"
            />
            {/* Container */}
            <div className="absolute inset-0 p-4 flex items-center justify-center">
                <div className="w-full max-w-2xl rounded-2xl border theme-border theme-card bg-white dark:bg-gray-950 shadow-2xl transition-all duration-150 scale-100 opacity-100 max-h-[85vh] flex flex-col">
                    {children}
                </div>
            </div>
        </div>,
        document.body,
    )
}

export function ModalHeader({
    title,
    subtitle,
    icon,
    onClose,
}: {
    title?: string
    subtitle?: string
    icon?: React.ReactNode
    onClose: () => void
}) {
    return (
        <div className="flex items-center justify-between p-6 border-b theme-border">
            <div className="flex items-start gap-3">
                {icon ? <div className="text-2xl leading-none">{icon}</div> : null}
                <div>
                    {title ? (
                        <h2 className="text-xl font-semibold theme-text tracking-tight">{title}</h2>
                    ) : null}
                    {subtitle ? <p className="text-sm theme-text-secondary mt-1">{subtitle}</p> : null}
                </div>
            </div>
            <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg transition-colors hover:theme-card-hover"
                aria-label="Close"
            >
                <X className="h-5 w-5 theme-text-secondary" strokeWidth={1.5} />
            </button>
        </div>
    )
}

export function ModalBody({ children }: PropsWithChildren) {
    // Make body scrollable if content exceeds max height
    return <div className="p-6 space-y-6 overflow-auto">{children}</div>
}

export function ModalFooter({ children }: PropsWithChildren) {
    return (
        <div className="flex items-center justify-end gap-3 p-6 border-t theme-border">{children}</div>
    )
}
