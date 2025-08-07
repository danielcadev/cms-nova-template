'use client';

import { TemplateCard, templatesData } from './TemplateCard';

interface TemplatesGridProps {
  onSelectTemplate: (template: string) => void;
}

export function TemplatesGrid({ onSelectTemplate }: TemplatesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {templatesData.map((template, index) => (
        <div key={template.id} className={template.id === 'flexible-cms' ? 'md:col-span-2 lg:col-span-1' : ''}>
          <TemplateCard
            {...template}
            delay={index * 0.1}
            onClick={template.href ? undefined : () => onSelectTemplate(template.id)}
          />
        </div>
      ))}
    </div>
  );
}
