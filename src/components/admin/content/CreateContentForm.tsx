import { PageLayout } from '@/components/admin/shared/PageLayout';
import { HeroSection } from '@/components/admin/shared/HeroSection';
import { FormContainer } from '@/components/admin/shared/FormContainer';
import { DynamicContentForm } from '@/components/cms/HeadlessCMS/DynamicContentForm';
import { PlusCircle, Sparkles, FileText } from 'lucide-react';

interface ContentType {
  id: string;
  name: string;
  apiIdentifier: string;
  description?: string;
  fields: Array<{
    id: string;
    label: string;
    apiIdentifier: string;
    type: 'TEXT' | 'RICH_TEXT' | 'NUMBER' | 'BOOLEAN' | 'DATE' | 'MEDIA';
    isRequired: boolean;
  }>;
}

interface CreateContentFormProps {
  contentType: ContentType;
  onSave: (data: Record<string, any>) => Promise<void>;
}

export function CreateContentForm({ contentType, onSave }: CreateContentFormProps) {
  return (
    <>
      <PageLayout 
        backgroundVariant="green"
        backLink={{
          href: `/admin/dashboard/content/${contentType.apiIdentifier}`,
          label: `Volver a ${contentType.name}`
        }}
      >
        <HeroSection
          badge={{
            icon: PlusCircle,
            title: "Crear Nuevo Contenido",
            subtitle: contentType.name,
            color: "bg-gradient-to-r from-green-500/10 to-emerald-600/10"
          }}
          title={`Nueva entrada de ${contentType.name}`}
          description={contentType.description || `Crea una nueva entrada de ${contentType.name.toLowerCase()} completando los campos de forma conversacional y sencilla.`}
          stats={[
            {
              value: contentType.fields.length,
              label: "Campos totales",
              color: "text-green-600"
            },
            {
              value: contentType.fields.filter(f => f.isRequired).length,
              label: "Requeridos", 
              color: "text-emerald-600"
            },
            {
              value: contentType.fields.filter(f => !f.isRequired).length,
              label: "Opcionales",
              color: "text-green-700"
            }
          ]}
        />
      </PageLayout>

      <FormContainer
        title="Asistente Conversacional"
        description="Te guiaremos paso a paso para crear tu contenido de manera intuitiva"
        icon={Sparkles}
        colorScheme="green"
      >
        <FieldsPreview fields={contentType.fields} />
        
        <DynamicContentForm
          contentType={contentType}
          mode="create"
          onSave={onSave}
        />
      </FormContainer>
    </>
  );
}

function FieldsPreview({ fields }: { fields: ContentType['fields'] }) {
  return (
    <div className="mb-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="h-5 w-5 text-gray-600" />
        <span className="font-bold text-gray-800">Campos a completar:</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {fields.map((field, index) => (
          <FieldChip key={field.id} field={field} index={index} />
        ))}
      </div>
    </div>
  );
}

function FieldChip({ field, index }: { field: ContentType['fields'][0]; index: number }) {
  return (
    <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-2xl border border-gray-200/50 text-sm shadow-sm">
      <span className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl flex items-center justify-center text-xs font-bold">
        {index + 1}
      </span>
      <span className="font-semibold text-gray-700">{field.label}</span>
      {field.isRequired && (
        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-semibold">
          Requerido
        </span>
      )}
    </div>
  );
}
