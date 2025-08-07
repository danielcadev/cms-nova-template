import { CreateContentTypeHeader } from './CreateContentTypeHeader';
import { CreateContentTypeForm } from './CreateContentTypeForm';

interface CreateContentTypePageProps {
  initialData?: any;
  contentTypeId?: string;
}

export function CreateContentTypePage({ initialData, contentTypeId }: CreateContentTypePageProps) {
  const isEditing = !!initialData && !!contentTypeId;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 relative">
      {/* Clean editorial background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-gray-950 dark:to-gray-900/50" />

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Editorial Header */}
          <CreateContentTypeHeader isEditing={isEditing} />

          {/* Editorial Form */}
          <div className="mt-16">
            <CreateContentTypeForm 
              initialData={initialData}
              contentTypeId={contentTypeId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Exportamos también los componentes individuales
export { CreateContentTypeHeader } from './CreateContentTypeHeader';
export { CreateContentTypeForm } from './CreateContentTypeForm';