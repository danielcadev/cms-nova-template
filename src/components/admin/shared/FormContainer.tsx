import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface FormContainerProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange';
}

const colorSchemes = {
  blue: {
    header: "bg-gradient-to-r from-blue-50 to-indigo-50",
    icon: "bg-gradient-to-br from-blue-500 to-indigo-600"
  },
  green: {
    header: "bg-gradient-to-r from-green-50 to-emerald-50",
    icon: "bg-gradient-to-br from-green-500 to-emerald-600"
  },
  purple: {
    header: "bg-gradient-to-r from-purple-50 to-violet-50",
    icon: "bg-gradient-to-br from-purple-500 to-violet-600"
  },
  orange: {
    header: "bg-gradient-to-r from-orange-50 to-amber-50",
    icon: "bg-gradient-to-br from-orange-500 to-amber-600"
  }
};

export function FormContainer({ 
  title, 
  description, 
  icon: Icon, 
  children, 
  colorScheme = 'blue' 
}: FormContainerProps) {
  const scheme = colorSchemes[colorScheme];

  return (
    <div className="container mx-auto px-8 py-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Card principal con el formulario */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          
          {/* Header del formulario */}
          <div className={`${scheme.header} p-8 border-b border-gray-100`}>
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 ${scheme.icon} rounded-3xl flex items-center justify-center shadow-xl`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {title}
                </h3>
                <p className="text-gray-600 text-lg">
                  {description}
                </p>
              </div>
            </div>
          </div>
          
          {/* Contenido del formulario */}
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
