'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useDebounce } from './useDebounce'
import { type PlanFormValues } from '@/schemas/plan'

interface UseSectionAutosaveProps {
  planId: string
  sectionName?: string
  fields?: (keyof PlanFormValues)[]
  delay?: number
  enabled?: boolean
  onSave?: (data: Partial<PlanFormValues>) => Promise<void>
  onError?: (error: any) => void
}

interface AutosaveState {
  isAutosaving: boolean
  lastSaved: Date | null
  hasUnsavedChanges: boolean
  error: string | null
}

export function useSectionAutosave({
  planId,
  sectionName = 'section',
  fields,
  delay = 2000,
  enabled = true,
  onSave,
  onError
}: UseSectionAutosaveProps) {
  const { watch, getValues } = useFormContext<PlanFormValues>()
  const [state, setState] = useState<AutosaveState>({
    isAutosaving: false,
    lastSaved: null,
    hasUnsavedChanges: false,
    error: null
  })

  const lastSavedValues = useRef<Partial<PlanFormValues>>({})

  // Observar solo los campos especificados o todos si no se especifican
  const watchedFields = fields ? watch(fields) : watch()
  const debouncedValues = useDebounce(watchedFields, delay)

  // Función para guardar los datos
  const saveData = useCallback(async (data: Partial<PlanFormValues>) => {
    if (!enabled) return

    setState(prev => ({ ...prev, isAutosaving: true, error: null }))

    try {
      if (onSave) {
        await onSave(data)
      } else {
        // Guardar en localStorage como fallback
        const storageKey = `autosave_${planId}_${sectionName}`
        localStorage.setItem(storageKey, JSON.stringify({
          data,
          timestamp: new Date().toISOString(),
          sectionName
        }))
      }

      lastSavedValues.current = { ...data }
      setState(prev => ({
        ...prev,
        isAutosaving: false,
        lastSaved: new Date(),
        hasUnsavedChanges: false,
        error: null
      }))

      console.log(`✅ Autosave: ${sectionName} guardado exitosamente`)
    } catch (error) {
      console.error(`❌ Autosave error en ${sectionName}:`, error)
      setState(prev => ({
        ...prev,
        isAutosaving: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }))
      
      if (onError) {
        onError(error)
      }
    }
  }, [enabled, onSave, planId, sectionName, onError])

  // Función para forzar el guardado
  const forceSave = useCallback(async () => {
    const currentValues = getValues()
    const dataToSave = fields 
      ? Object.fromEntries(fields.map(field => [field, currentValues[field]]))
      : currentValues
    
    await saveData(dataToSave)
  }, [getValues, fields, saveData])

  // Efecto para autosave cuando cambien los valores
  useEffect(() => {
    if (!enabled || !debouncedValues) return

    const currentValues = fields 
      ? Object.fromEntries(fields.map(field => [field, getValues(field)]))
      : getValues()

    // Verificar si hay cambios reales
    const hasChanges = JSON.stringify(currentValues) !== JSON.stringify(lastSavedValues.current)
    
    if (hasChanges) {
      setState(prev => ({ ...prev, hasUnsavedChanges: true }))
      saveData(currentValues)
    }
  }, [debouncedValues, enabled, fields, getValues, saveData])

  // Cargar datos guardados al inicializar
  useEffect(() => {
    if (!enabled) return

    const storageKey = `autosave_${planId}_${sectionName}`
    const savedData = localStorage.getItem(storageKey)
    
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        const savedTime = new Date(parsed.timestamp)
        
        setState(prev => ({ 
          ...prev, 
          lastSaved: savedTime 
        }))
        
        console.log(`📦 Datos de autosave cargados para ${sectionName}`)
      } catch (error) {
        console.error(`Error cargando autosave para ${sectionName}:`, error)
      }
    }
  }, [enabled, planId, sectionName])

  return {
    ...state,
    forceSave,
    clearAutosave: useCallback(() => {
      const storageKey = `autosave_${planId}_${sectionName}`
      localStorage.removeItem(storageKey)
      setState({
        isAutosaving: false,
        lastSaved: null,
        hasUnsavedChanges: false,
        error: null
      })
    }, [planId, sectionName])
  }
}
