import {
    FileText,
    MapPin,
    PlusCircle,
    UtensilsCrossed,
} from 'lucide-react'

export interface Template {
    id: string
    name: string
    description: string
    status: 'active' | 'draft' | 'coming-soon'
    icon: any // LucideIcon type could be more specific but 'any' matches identifying code
    category: string
    contentCount?: number
    route?: string
}

export interface RecentContent {
    id: string
    title: string
    type: string
    status: 'published' | 'draft'
    createdAt: string
    author: string
    route: string
}

export const getTemplates = (contentCounts: {
    touristPlans: number
    experiences: number
    contentTypes: number
}): Template[] => [
        {
            id: '1',
            name: 'Tourism Plans',
            description: 'Complete structure for creating detailed travel itineraries and packages.',
            status: 'active',
            icon: FileText,
            category: 'Tourism',
            contentCount: contentCounts.touristPlans,
            route: '/admin/dashboard/templates/tourism',
        },
        {
            id: '2',
            name: 'Experiences',
            description: 'Story-driven journeys to highlight unique Colombian hosts and stories.',
            status: 'active',
            icon: MapPin,
            category: 'Tourism',
            contentCount: contentCounts.experiences,
            route: '/admin/dashboard/templates/experiences',
        },
        {
            id: '4',
            name: 'Flexible Content',
            description: 'Create completely customized content types for any data structure.',
            status: 'active',
            icon: PlusCircle,
            category: 'General',
            contentCount: contentCounts.contentTypes,
            route: '/admin/dashboard/content-types',
        },
        {
            id: '3',
            name: 'Restaurants',
            description: 'Template for menus, reservations and restaurant management.',
            status: 'coming-soon',
            icon: UtensilsCrossed,
            category: 'Food & Beverage',
            contentCount: 0,
        },
    ]
