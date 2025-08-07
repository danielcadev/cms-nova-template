import ContentTypeForm from '@/components/admin/content-types/ContentTypesManager/ContentTypeForm';

interface CreateContentTypeFormProps {
  initialData?: any;
  contentTypeId?: string;
}

export function CreateContentTypeForm({ initialData, contentTypeId }: CreateContentTypeFormProps) {
  return (
    <div className="w-full">
      <ContentTypeForm 
        initialData={initialData}
        contentTypeId={contentTypeId}
      />
    </div>
  );
}