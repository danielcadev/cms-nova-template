'use client'

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { toCamelCase } from '@/utils/formatters'
import type { ContentTypeFormValues } from '../ContentTypeForm'
import { fieldTypes } from './constants'
import { DropPlaceholder } from './DropPlaceholder'
import { PaletteItem } from './PaletteItem'
import { SortableFieldRow } from './SortableFieldRow'

// Componente para la zona de drop vacía
function EmptyDropZone({ activeId }: { activeId: string | null }) {
  const t = useTranslations('contentTypes.form.builder')
  const { setNodeRef, isOver } = useDroppable({
    id: 'empty-drop-zone',
  })

  return (
    <div
      ref={setNodeRef}
      className={`text-center py-16 border-2 border-dashed rounded-xl transition-all duration-300 ${isOver || activeId?.startsWith('palette-')
        ? 'border-zinc-400 bg-zinc-50'
        : 'border-zinc-200 bg-zinc-50/50'
        }`}
    >
      <div className="w-12 h-12 mx-auto bg-white border border-zinc-200 rounded-xl flex items-center justify-center mb-4 shadow-sm">
        <Plus className="h-6 w-6 text-zinc-400" />
      </div>
      <h4 className="text-lg font-semibold text-zinc-900 mb-2">
        {activeId?.startsWith('palette-') ? t('emptyTitleDrop') : t('emptyTitle')}
      </h4>
      <p className="text-sm text-zinc-500 max-w-md mx-auto">
        {activeId?.startsWith('palette-') ? t('emptyDescDrop') : t('emptyDesc')}
      </p>
    </div>
  )
}

export default function FieldsBuilder() {
  const t = useTranslations('contentTypes.form.builder')
  const { control, setValue } = useFormContext<ContentTypeFormValues>()
  const { fields, append, remove, move } = useFieldArray({ control, name: 'fields' })
  const [activeId, setActiveId] = useState<string | null>(null)
  const [_overId, setOverId] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const handleDragStart = (event: DragEndEvent) => setActiveId(event.active.id as string)
  const handleDragOver = (event: DragEndEvent) => setOverId(event.over?.id as string | null)
  const handleDragCancel = () => setActiveId(null)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setOverId(null)
    if (!over) return

    if (active.id.toString().startsWith('palette-')) {
      const fieldType = active.id.toString().replace('palette-', '')
      const newLabel = 'New Field'
      const newField = {
        id: `field-${Date.now()}`,
        label: newLabel,
        apiIdentifier: toCamelCase(newLabel),
        type: fieldType as any,
        isRequired: false,
      }

      // Si se suelta en la zona vacía o no hay campos
      if (over.id === 'empty-drop-zone' || fields.length === 0) {
        append(newField)
        return
      }

      const overIdStr = over.id.toString()
      if (overIdStr.startsWith('drop-before-') || overIdStr.startsWith('drop-after-')) {
        const [, position, rawIndex] = overIdStr.split('-')
        const baseIndex = parseInt(rawIndex, 10)
        const insertIndex = position === 'before' ? baseIndex : baseIndex + 1
        const newFields = [...fields]
        newFields.splice(insertIndex, 0, newField)
        setValue('fields', newFields, { shouldDirty: true, shouldValidate: true })
      } else {
        // Insertar en posición específica
        const overIndex = fields.findIndex((f) => f.id === over.id)
        if (overIndex !== -1) {
          const newFields = [...fields]
          // por defecto, insertar después del elemento sobre el que estamos
          newFields.splice(overIndex + 1, 0, newField)
          setValue('fields', newFields, { shouldDirty: true, shouldValidate: true })
        } else {
          // Si no encuentra la posición, agregar al final
          append(newField)
        }
      }
      return
    }

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id)
      let newIndex = fields.findIndex((f) => f.id === over.id)
      if (
        over.id.toString().startsWith('drop-before-') ||
        over.id.toString().startsWith('drop-after-')
      ) {
        const [, position, rawIndex] = over.id.toString().split('-')
        const baseIndex = parseInt(rawIndex, 10)
        newIndex = position === 'before' ? baseIndex : baseIndex + 1
      }
      if (oldIndex !== -1 && newIndex !== -1) move(oldIndex, newIndex)
    }
  }

  const activeItem = activeId
    ? fieldTypes.find((f) => `palette-${f.type}` === activeId) ||
    fields.find((f) => f.id === activeId)
    : null

  if (!isMounted) {
    return null
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragCancel={handleDragCancel}
    >
      <div className="space-y-8">
        {/* Field Types Palette */}
        <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-5">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
            {t('availableTypes')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {fieldTypes.map((ft) => (
              <div key={ft.type}>
                <PaletteItem fieldType={ft} />
              </div>
            ))}
          </div>
        </div>

        {/* Fields List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-900">{t('fieldsCount', { count: fields.length })}</h3>
            {fields.length > 0 && <span className="text-xs text-zinc-500">Drag to reorder</span>}
          </div>

          <SortableContext items={fields} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {/* Drop before first */}
              {activeId?.startsWith('palette-') && <DropPlaceholder id={`drop-before-0`} />}

              {fields.map((field, index) => (
                <div key={field.id}>
                  <SortableFieldRow field={field} index={index} remove={remove} />
                  {activeId?.startsWith('palette-') && (
                    <DropPlaceholder id={`drop-after-${index}`} />
                  )}
                </div>
              ))}
            </div>
          </SortableContext>

          {fields.length === 0 && <EmptyDropZone activeId={activeId} />}
        </div>
      </div>

      {/* Drag Overlay */}
      {isMounted &&
        createPortal(
          <DragOverlay>
            {activeId && activeItem ? (
              <div className="bg-white rounded-xl shadow-xl border border-zinc-200 p-4 flex items-center gap-3 cursor-grabbing ring-2 ring-zinc-900 ring-offset-2">
                <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center border border-zinc-200">
                  <span className="text-zinc-600">{(activeItem as any)?.icon}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-zinc-900 text-sm">{activeItem?.label}</span>
                  <span className="text-xs text-zinc-500">Moving...</span>
                </div>
              </div>
            ) : null}
          </DragOverlay>,
          document.body,
        )}
    </DndContext>
  )
}
