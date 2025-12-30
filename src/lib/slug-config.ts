import { REGIONS_DATA } from '@/data/regions-static'

export type WizardStepConfig = {
    param: string
    label: string
    childrenKey?: string // Key to find the next level options in the selected object
    optionLabelKey: string // Key to display in the dropdown (e.g., 'name')
    entity?: 'region' | 'subRegion' | 'zone'
    modalLabel?: string // Override the default modal title (e.g., show "Ciudad" instead of "Región")
}

export type WizardConfig = {
    rootParam: string // The parameter that triggers this wizard
    type: 'static-hierarchy' | 'database-list' | 'database-hierarchy'
    data?: any[] // For static
    steps: WizardStepConfig[]
}

export const SLUG_WIZARDS: Record<string, WizardConfig> = {
    // Configuration for "Regiones" route: [regionName]/[subRegionName]/[zonaName]
    regionName: {
        rootParam: 'regionName',
        type: 'database-hierarchy', // Switched to DB mode
        data: undefined, // Data now comes from API
        steps: [
            { param: 'regionName', label: 'Región', childrenKey: 'subRegions', optionLabelKey: 'name', entity: 'region' },
            { param: 'subRegionName', label: 'Subregión', childrenKey: 'zones', optionLabelKey: 'name', entity: 'subRegion' },
            { param: 'zonaName', label: 'Zona / Municipio', optionLabelKey: 'name', childrenKey: '', entity: 'zone' }
        ]
    },
    // Configuration for "Experiences" route: [city]/[slug]
    city: {
        rootParam: 'city',
        type: 'database-hierarchy', // Using hierarchy logic but only for 1 level (root)
        steps: [
            {
                param: 'city',
                label: 'Ciudad / Destino',
                optionLabelKey: 'name',
                entity: 'region', // We treat root items as Regions in DB
                modalLabel: 'Ciudad / Destino' // But show "Ciudad" to the user
            }
        ]
    }
}
