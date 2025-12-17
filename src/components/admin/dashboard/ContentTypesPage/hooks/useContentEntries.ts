import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import type { ContentEntry } from '../data'

export function useContentEntries(contentTypeSlug: string) {
    const [entries, setEntries] = useState<ContentEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const router = useRouter()
    const { toast } = useToast()

    const loadEntries = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/content-types/${contentTypeSlug}/entries`)
            if (response.ok) {
                const data = await response.json()
                setEntries(data)
            } else {
                toast({
                    title: 'Error',
                    description: 'Failed to load content entries',
                    variant: 'destructive',
                })
            }
        } catch (error) {
            console.error('Error loading entries:', error)
            toast({
                title: 'Error',
                description: 'Failed to load content entries',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }, [contentTypeSlug, toast])

    useEffect(() => {
        loadEntries()
    }, [loadEntries])

    const handleDeleteEntry = async (entryId: string) => {
        if (!confirm('Are you sure you want to delete this entry?')) return

        try {
            const response = await fetch(`/api/content-types/${contentTypeSlug}/entries/${entryId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                toast({
                    title: 'Success',
                    description: 'Entry deleted successfully',
                })
                loadEntries()
            } else {
                toast({
                    title: 'Error',
                    description: 'Failed to delete entry',
                    variant: 'destructive',
                })
            }
        } catch (error) {
            console.error('Error deleting entry:', error)
            toast({
                title: 'Error',
                description: 'Failed to delete entry',
                variant: 'destructive',
            })
        }
    }

    const filteredEntries = entries.filter(
        (entry) =>
            entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.slug.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return {
        entries,
        loading,
        searchTerm,
        setSearchTerm,
        handleDeleteEntry,
        filteredEntries,
        router
    }
}
