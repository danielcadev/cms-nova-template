'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { MediaLibraryProvider, type MediaLibraryState } from '../useMediaLibrary'
import { PickerModal } from './PickerModal'
import type { MediaItem } from '../types'

interface MediaPickerProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (item: MediaItem) => void
    title?: string
    folder?: string
}

export function MediaPicker({
    isOpen,
    onClose,
    onSelect,
    title = 'Select Media',
    folder,
}: MediaPickerProps) {
    const [localOpen, setLocalOpen] = useState(isOpen)
    const [isMounted, setIsMounted] = useState(false)
    const [themeClassNames, setThemeClassNames] = useState('')
    const [themeDataTheme, setThemeDataTheme] = useState<string | null>(null)
    const [themeStyleText, setThemeStyleText] = useState<string | null>(null)
    const portalRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        setLocalOpen(isOpen)
    }, [isOpen])

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (!isMounted || !localOpen || typeof document === 'undefined') return
        const host = document.querySelector('.admin-scope') as HTMLElement | null
        if (!host) return
        const classes = Array.from(host.classList).filter(
            (item) => ['dark'].includes(item) || item.startsWith('theme-'),
        )
        setThemeClassNames(classes.join(' '))
        setThemeDataTheme(host.getAttribute('data-theme'))
        setThemeStyleText(host.getAttribute('style'))
    }, [isMounted, localOpen])

    useEffect(() => {
        if (!portalRef.current) return
        const styleValue = themeStyleText ?? ''
        if (styleValue) {
            portalRef.current.setAttribute('style', styleValue)
        } else {
            portalRef.current.removeAttribute('style')
        }
    }, [themeStyleText])

    useEffect(() => {
        if (!isMounted) return
        if (!localOpen) return
        const original = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = original
        }
    }, [isMounted, localOpen])

    if (!localOpen || !isMounted || typeof document === 'undefined') return null

    return createPortal(
        <div
            ref={(node) => {
                portalRef.current = node
            }}
            className={themeClassNames}
            data-theme={themeDataTheme ?? undefined}
        >
            <MediaLibraryProvider initialFolder={folder ?? ''}>
                <PickerModal
                    title={title}
                    folder={folder}
                    onClose={() => {
                        setLocalOpen(false)
                        onClose()
                    }}
                    onSelect={(item) => {
                        onSelect(item)
                        setLocalOpen(false)
                        onClose()
                    }}
                />
            </MediaLibraryProvider>
        </div>,
        document.body,
    )
}
