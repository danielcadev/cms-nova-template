import slugify from 'slugify'
import { useFormContext, useWatch } from 'react-hook-form'
import { SlugField } from '@/components/admin/content-types/fields/SlugField'
import { DynamicFieldRenderer } from './index'
import type { Field } from '../EditContentEntryPage/data'
import { MapPin, ChevronRight, Link as LinkIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { SLUG_WIZARDS } from '@/lib/slug-config'
import { SlugRouteSteppers } from './SlugRouteSteppers'

interface SmartSlugRendererProps {
    field: any
    value: any
    onChange: (val: any) => void
    onAutoGenerate?: () => void
    fieldId?: string
    allFields?: Field[]
}

export function SmartSlugRenderer({
    field,
    value,
    onChange,
    onAutoGenerate,
    fieldId,
    allFields = [],
}: SmartSlugRendererProps) {
    const t = useTranslations('dynamicFields.slug')
    const { control, setValue } = useFormContext()
    const slugRoute = (field.metadata as any)?.slugRoute as string | undefined

    // 1. Identify variables in the route
    const routeParams = slugRoute ? Array.from(slugRoute.matchAll(/\[([^\]]+)\]/g)).map(m => m[1]) : []

    // 2. Watch these variables to build the preview URL
    const watchedValues = useWatch({
        control,
        name: routeParams,
    })

    // Check if we have a wizard configuration for this route
    let activeWizardKey: string | undefined = undefined
    for (const key in SLUG_WIZARDS) {
        if (routeParams.includes(SLUG_WIZARDS[key].rootParam)) {
            activeWizardKey = key
            break
        }
    }

    // 3. Find Field Definitions for the params to render them
    // We exclude 'slug' itself, '...slug', and the current field to avoid recursion
    // We also exclude fields handled by the active wizard
    const wizardParams = activeWizardKey ? SLUG_WIZARDS[activeWizardKey].steps.map(s => s.param) : []

    const paramFields = routeParams
        .filter(param =>
            param !== 'slug' &&
            param !== '...slug' &&
            param !== field.apiIdentifier &&
            !wizardParams.includes(param)
        )
        .map(param => allFields.find(f => f.apiIdentifier === param))
        .filter(Boolean) as Field[]

    let previewUrl = undefined
    let isFullyDefinedByOtherFields = false

    if (slugRoute) {
        // 4. Construct the preview URL
        let builtUrl = slugRoute

        routeParams.forEach((param, index) => {
            const val = watchedValues[index]
            if (val) {
                const slugifiedVal = slugify(String(val), { lower: true, strict: true })
                builtUrl = builtUrl.replace(`[${param}]`, slugifiedVal)
            } else {
                // Keep the placeholder if value is missing
                if (param !== 'slug' && param !== '...slug') {
                    builtUrl = builtUrl.replace(`[${param}]`, `[${param}]`)
                }
            }
        })

        // Check if the slug component itself contributes to the URL
        const usesSelf = slugRoute.includes('[slug]') || slugRoute.includes('[...slug]') || slugRoute.includes(`[${field.apiIdentifier}]`)

        if (!usesSelf) {
            // If the slug is not in the route, we append it as the final segment
            // This ensures every entry has its own unique URL segment
            builtUrl = `${builtUrl}/${value || `[${field.apiIdentifier}]`}`
        } else {
            // Replace the placeholder with the actual value for preview
            const selfPlaceholder = slugRoute.includes('[slug]') ? '[slug]' :
                slugRoute.includes('[...slug]') ? '[...slug]' :
                    `[${field.apiIdentifier}]`
            builtUrl = builtUrl.replace(selfPlaceholder, value || selfPlaceholder)
        }

        isFullyDefinedByOtherFields = false // We always want the input field for the slug itself
        previewUrl = builtUrl.replace(/\/+/g, '/') // Clean double slashes
    }

    return (
        <div className="space-y-4">
            {/* Render Wizard if applicable */}
            {activeWizardKey && (
                <SlugRouteSteppers routeParams={routeParams} wizardKey={activeWizardKey} />
            )}

            {/* Render Dependent Fields ("Automatic Fields") - Only those NOT in wizard */}
            {paramFields.length > 0 && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                    {/* Header */}
                    <div className="px-4 py-3 bg-zinc-50/50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-1.5 rounded-lg">
                            <MapPin className="h-4 w-4" />
                        </div>
                        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                            {t('routeBuilder')}
                        </h3>
                    </div>

                    {/* Fields Grid */}
                    <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        {paramFields.map((paramField, idx) => {
                            const paramValue = useWatch({ control, name: paramField.apiIdentifier })
                            return (
                                <div key={paramField.id} className="relative">
                                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 ml-1 block uppercase tracking-wider">
                                        {t('step', { number: idx + 1 + (activeWizardKey ? 3 : 0) })}: {paramField.label.replace('Lista de Selección', '').replace('Name', '')}
                                    </label>
                                    <DynamicFieldRenderer
                                        field={paramField}
                                        value={paramValue}
                                        onChange={(val) => setValue(paramField.apiIdentifier, val, { shouldDirty: true, shouldValidate: true })}
                                        fieldId={`smart-field-${paramField.id}`}
                                        variant="default"
                                        allFields={allFields}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <SlugField
                value={value}
                onChange={onChange}
                onAutoGenerate={onAutoGenerate}
                placeholder={field.label || 'url-slug'}
                id={fieldId}
                previewUrl={previewUrl}
                isDerived={isFullyDefinedByOtherFields}
            />
        </div>
    )
}
