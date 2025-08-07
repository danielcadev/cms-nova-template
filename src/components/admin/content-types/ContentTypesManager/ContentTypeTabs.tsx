'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DndContext, 
  closestCenter, 
  useSensors, 
  useSensor, 
  PointerSensor,
  DragEndEvent,
  DragOverlay
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { TabContent } from './TabContent';
import { SortableFieldCard } from './FieldCard';

interface ContentTypeTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: any;
  showNewFieldForm: boolean;
  onShowNewFieldForm: () => void;
  onHideNewFieldForm: () => void;
  onAddField: (field: any) => void;
  onDeleteField: (fieldId: string) => void;
  onFieldsReorder: (fields: any[]) => void;
  isDragOver: boolean;
  activeField: any;
  isMounted: boolean;
  onDragStart: (event: any) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragOver: (event: any) => void;
}

export function ContentTypeTabs({
  activeTab,
  setActiveTab,
  formData,
  showNewFieldForm,
  onShowNewFieldForm,
  onHideNewFieldForm,
  onAddField,
  onDeleteField,
  onFieldsReorder,
  isDragOver,
  activeField,
  isMounted,
  onDragStart,
  onDragEnd,
  onDragOver
}: ContentTypeTabsProps) {
  // Configuración de sensores para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-200 rounded-lg p-1">
          <TabsTrigger value="fields" className="rounded-md text-sm py-2 px-3 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm font-medium">
            Campos
          </TabsTrigger>
          <TabsTrigger value="info" className="rounded-md text-sm py-2 px-3 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm font-medium">
            Información
          </TabsTrigger>
          <TabsTrigger value="preview" className="rounded-md text-sm py-2 px-3 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm font-medium">
            Vista Previa
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-md text-sm py-2 px-3 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm font-medium">
            Configuración
          </TabsTrigger>
        </TabsList>

        {/* Contexto de drag & drop */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <SortableContext 
            items={formData?.fields?.map((f: any) => f.id) || []}
            strategy={verticalListSortingStrategy}
          >
            <TabsContent value={activeTab} className="mt-6">
              <TabContent
                activeTab={activeTab}
                formData={formData}
                showNewFieldForm={showNewFieldForm}
                onShowNewFieldForm={onShowNewFieldForm}
                onHideNewFieldForm={onHideNewFieldForm}
                onAddField={onAddField}
                onDeleteField={onDeleteField}
                onFieldsReorder={onFieldsReorder}
                isDragOver={isDragOver}
              />
            </TabsContent>
          </SortableContext>

          {/* Overlay para drag & drop */}
          {isMounted && createPortal(
            <DragOverlay>
              {activeField ? (
                <div className="opacity-60">
                  <SortableFieldCard
                    field={activeField}
                    onDelete={() => {}}
                  />
                </div>
              ) : null}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </Tabs>
    </div>
  );
}
