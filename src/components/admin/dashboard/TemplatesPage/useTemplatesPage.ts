import { useEffect, useState } from 'react'
import { getTemplates, RecentContent, Template } from './data'

export function useTemplatesPage() {
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [recentContent, setRecentContent] = useState<RecentContent[]>([])
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [contentCounts, setContentCounts] = useState({
        touristPlans: 0,
        experiences: 0,
        contentTypes: 0,
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)

            // Fetch tourist plans from API
            const plansResponse = await fetch('/api/plans')
            const experiencesResponse = await fetch('/api/experiences')

            let recentItems: RecentContent[] = []

            if (plansResponse.ok) {
                const plansData = await plansResponse.json()
                const plans = plansData.plans || []

                setContentCounts((prev) => ({
                    ...prev,
                    touristPlans: plans.length,
                }))

                const recentPlans: RecentContent[] = plans
                    .sort(
                        (a: any, b: any) =>
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                    )
                    .slice(0, 6)
                    .map((plan: any) => ({
                        id: plan.id,
                        title: plan.mainTitle || 'Untitled Plan',
                        type: 'Tourism Plan',
                        status: plan.published ? 'published' : 'draft',
                        createdAt: plan.createdAt,
                        author: 'Admin',
                        route: `/admin/dashboard/templates/tourism/edit/${plan.id}`,
                    }))

                recentItems = recentItems.concat(recentPlans)
            }

            if (experiencesResponse.ok) {
                const experiencesData = await experiencesResponse.json()
                const experiences = experiencesData.experiences || []

                setContentCounts((prev) => ({
                    ...prev,
                    experiences: experiences.length,
                }))

                const recentExperiences: RecentContent[] = experiences
                    .sort(
                        (a: any, b: any) =>
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                    )
                    .slice(0, 6)
                    .map((experience: any) => ({
                        id: experience.id,
                        title: experience.title || 'Untitled Experience',
                        type: 'Experience',
                        status: experience.published ? 'published' : 'draft',
                        createdAt: experience.createdAt,
                        author: experience.hostName || 'Admin',
                        route: `/experiencias/${experience.locationAlias}/${experience.slug}`,
                    }))

                recentItems = recentItems.concat(recentExperiences)
            }

            if (recentItems.length) {
                recentItems.sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                )
                setRecentContent(recentItems.slice(0, 6))
            }

            // Fetch content types count
            try {
                const contentTypesResponse = await fetch('/api/content-types')
                if (contentTypesResponse.ok) {
                    const contentTypesData = await contentTypesResponse.json()
                    const contentTypes = contentTypesData.contentTypes || []

                    setContentCounts((prev) => ({
                        ...prev,
                        contentTypes: contentTypes.length,
                    }))
                }
            } catch (error) {
                console.error('Error fetching content types:', error)
            }
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await loadData() // Better to re-fetch than reload window
        setIsRefreshing(false)
    }

    const templates = getTemplates(contentCounts)

    const filteredTemplates = templates.filter(
        (template) =>
            template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return {
        loading,
        searchTerm,
        setSearchTerm,
        recentContent,
        isRefreshing,
        filteredTemplates,
        handleRefresh,
    }
}
