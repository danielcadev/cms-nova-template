import React, { useEffect, useState, useMemo } from 'react'
import { Check, ChevronsUpDown, ChevronRight, Plus, Trash2, Loader2, MoreHorizontal } from 'lucide-react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useFormContext } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { SLUG_WIZARDS, WizardConfig } from '@/lib/slug-config'
import { getSlugHierarchy, createSlugItem, deleteSlugItem, type RegionHierarchy } from '@/app/actions/slug-data'
import { ManageOptionModal } from './ManageOptionModal'
import { cn } from '@/lib/utils' // Assuming standard util exists, or I will use 'clsx' if fails

interface SlugRouteSteppersProps {
    routeParams: string[]
    wizardKey: string
}

export function SlugRouteSteppers({ routeParams, wizardKey }: SlugRouteSteppersProps) {
    const t = useTranslations('dynamicFields.wizard')
    const { setValue, watch } = useFormContext()
    const config = SLUG_WIZARDS[wizardKey]

    const [data, setData] = useState<RegionHierarchy[]>([])
    const [loading, setLoading] = useState(true)
    const [openStep, setOpenStep] = useState<number | null>(null)

    // Modal State
    const [modalOpen, setModalOpen] = useState(false)
    const [modalType, setModalType] = useState<'region' | 'subRegion' | 'zone'>('region')
    const [modalParentId, setModalParentId] = useState<string | undefined>(undefined)
    const [modalParentName, setModalParentName] = useState<string | undefined>(undefined)
    const [modalCustomTitle, setModalCustomTitle] = useState<string | undefined>(undefined)
    const [modalInitialValue, setModalInitialValue] = useState<string | undefined>(undefined)

    const [searchQuery, setSearchQuery] = useState('')

    // Reset search when step changes
    useEffect(() => {
        setSearchQuery('')
    }, [openStep])

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await getSlugHierarchy()
            setData(res)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (config.type === 'static-hierarchy') return // Skip if static (legacy support)
        fetchData()
    }, [config.type])

    // Helper to traverse and find current level options
    const getStepContext = (stepIndex: number) => {
        if (config.type === 'static-hierarchy' && config.data) {
            // ... existing static logic if needed, or remove if migrated fully
            return { options: [], parentId: undefined, parentName: undefined }
        }

        // DB Logic
        let currentOptions: any[] = data
        let parentId: string | undefined = undefined
        let parentName: string | undefined = undefined

        // Traverse down based on previous selections
        for (let i = 0; i < stepIndex; i++) {
            const stepConfig = config.steps[i]
            const val = watch(stepConfig.param)
            if (!val) return { options: [], parentId: undefined, parentName: undefined }

            const found = currentOptions.find(opt => opt.name === val)
            if (!found) return { options: [], parentId: undefined, parentName: undefined }

            parentId = found.id
            parentName = found.name
            // Determine children key based on config
            const childKey = stepConfig.childrenKey
            if (childKey && (found as any)[childKey]) {
                currentOptions = (found as any)[childKey] || []
            } else {
                currentOptions = []
            }
        }

        return { options: currentOptions, parentId, parentName }
    }

    const handleDelete = async (type: 'region' | 'subRegion' | 'zone', id: string, name: string) => {
        if (confirm(`¿Estás seguro de eliminar "${name}"? Se borrarán todos sus items dependientes.`)) {
            await deleteSlugItem(type, id)
            await fetchData()
            // Clear form values that might be invalid now
            // (Logic to clear precise fields could be added here)
        }
    }

    if (!config) return null

    return (
        <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden mb-6">
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <span className="text-xs font-bold">1</span>
                    </div>
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {t('title')}
                    </h3>
                </div>
                <Button variant="ghost" size="sm" onClick={fetchData} className="h-6 w-6 p-0">
                    <Loader2 className={cn("h-3 w-3", loading && "animate-spin")} />
                </Button>
            </div>

            <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {config.steps.map((step, index) => {
                    // REMOVED: if (!routeParams.includes(step.param)) return null 
                    // We render all steps in the wizard config, even helpers.

                    const { options, parentId, parentName } = getStepContext(index)
                    const currentValue = watch(step.param)
                    const isDisabled = index > 0 && !watch(config.steps[index - 1].param)
                    const isOpen = openStep === index

                    // Explicit type from config
                    const stepType = step.entity || 'region'

                    return (
                        <div key={step.param} className="space-y-1.5 relative">
                            <label className="text-xs uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 ml-1">
                                {step.label}
                            </label>

                            <Popover open={isOpen} onOpenChange={(open) => setOpenStep(open ? index : null)}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        disabled={isDisabled}
                                        className={cn(
                                            "w-full justify-between font-normal",
                                            !currentValue && "text-muted-foreground"
                                        )}
                                    >
                                        {currentValue || t('select', { label: step.label })}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0" align="start">
                                    <Command>
                                        <CommandInput
                                            placeholder={t('search', { label: step.label })}
                                            onValueChange={setSearchQuery}
                                        />
                                        <CommandList>
                                            <CommandEmpty>
                                                <div className="p-2 space-y-2">
                                                    <p className="text-sm text-zinc-500 text-center">{t('noResults')}</p>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                        onClick={() => {
                                                            setModalType(stepType)
                                                            setModalParentId(parentId)
                                                            setModalParentName(parentName)
                                                            setModalCustomTitle(step.modalLabel ? `Agregar ${step.modalLabel}` : undefined)
                                                            setModalInitialValue(searchQuery)
                                                            setModalOpen(true)
                                                            setOpenStep(null)
                                                        }}
                                                    >
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        {t('create', { query: searchQuery || step.label })}
                                                    </Button>
                                                </div>
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {options.map((option: any) => (
                                                    <CommandItem
                                                        key={option.id}
                                                        value={option.name}
                                                        onSelect={(currentValue) => {
                                                            setValue(step.param, option.name, { shouldValidate: true }) // Store Name
                                                            setOpenStep(null)
                                                            // Clear subsequent
                                                            for (let i = index + 1; i < config.steps.length; i++) {
                                                                setValue(config.steps[i].param, '', { shouldValidate: true })
                                                            }
                                                        }}
                                                        className="group flex justify-between items-center"
                                                    >
                                                        <div className="flex items-center">
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    currentValue === option.name ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {option.name}
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleDelete(stepType, option.id, option.name)
                                                            }}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                            <CommandSeparator />
                                            <CommandGroup>
                                                <CommandItem
                                                    onSelect={() => {
                                                        setModalType(stepType)
                                                        setModalParentId(parentId)
                                                        setModalParentName(parentName)
                                                        setModalCustomTitle(step.modalLabel ? `Agregar ${step.modalLabel}` : undefined)
                                                        setModalInitialValue(searchQuery)
                                                        setModalOpen(true)
                                                        setOpenStep(null)
                                                    }}
                                                    className="text-blue-600 dark:text-blue-400 cursor-pointer"
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    {searchQuery
                                                        ? t('create', { query: searchQuery })
                                                        : t('createNew', { label: step.label })
                                                    }
                                                </CommandItem>
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            {/* Chevron connector */}
                            {index < config.steps.length - 1 && (
                                <div className="absolute top-1/2 -right-3 -translate-y-1/2 hidden lg:block text-zinc-300 dark:text-zinc-700 pointer-events-none z-10">
                                    <ChevronRight className="h-5 w-5" />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            <ManageOptionModal
                isOpen={modalOpen}
                onOpenChange={setModalOpen}
                type={modalType}
                parentName={modalParentName}
                customTitle={modalCustomTitle}
                initialValue={modalInitialValue}
                onSave={async (name) => {
                    await createSlugItem(modalType, name, modalParentId)
                    await fetchData()
                }}
            />
        </div>
    )
}
