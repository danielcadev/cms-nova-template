'use client';

import { 
  FileText, 
  ChevronRight,
  UtensilsCrossed,
  CalendarDays,
  Building,
  PlusCircle
} from 'lucide-react';
import Link from 'next/link';

interface TemplateCardProps {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  delay: number;
  onClick?: () => void;
  href?: string;
  isActive?: boolean;
  isComingSoon?: boolean;
}

export function TemplateCard({ 
  id, 
  title, 
  description, 
  icon: Icon, 
  color, 
  delay, 
  onClick, 
  href,
  isActive = false,
  isComingSoon = false 
}: TemplateCardProps) {
  const CardContent = () => (
    <div
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className={`relative ${isActive ? 'bg-white/90' : 'bg-white/60'} backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 ${isActive ? 'border border-white/50' : 'border-2 border-dashed border-gray-200'} overflow-hidden h-full flex flex-col justify-center`}>
        {/* Efecto de fondo */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
        
        <div className="relative text-center">
          {/* Icono */}
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-200 shadow-lg">
            <Icon className="h-10 w-10 text-white" />
          </div>
          
          {/* Título */}
          <h2 className={`text-2xl font-bold ${isActive ? 'text-gray-900' : 'text-gray-500'} mb-4 transition-colors duration-200`}>
            {title}
          </h2>
          
          {/* Descripción */}
          <p className={`${isActive ? 'text-gray-600' : 'text-gray-400'} mb-8 leading-relaxed`}>
            {description}
          </p>
          
          {/* Call to action */}
          {isComingSoon ? (
            <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl">
              <span className="text-sm text-gray-500 font-medium">Próximamente</span>
            </div>
          ) : isActive ? (
            <div className="flex items-center justify-center text-blue-600 font-semibold">
              <span>Ver planes creados</span>
              <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          ) : (
            <div className="flex items-center justify-center text-indigo-600 font-semibold">
              <span>Ir al CMS Flexible</span>
              <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}

// Templates data
export const templatesData = [
  {
    id: 'tourist-plan',
    title: 'Planes Turísticos',
    description: 'Estructura completa para crear itinerarios de viaje detallados con precios, actividades y gestión de reservas.',
    icon: FileText,
    color: 'from-blue-500/5 to-blue-600/10',
    isActive: true,
    href: '/admin/dashboard/templates/tourism'
  },
  {
    id: 'restaurants',
    title: 'Restaurantes',
    description: 'Plantilla para menús, descripciones gastronómicas y gestión de restaurantes.',
    icon: UtensilsCrossed,
    color: 'from-orange-500/5 to-orange-600/10',
    isComingSoon: true
  },
  {
    id: 'events',
    title: 'Eventos',
    description: 'Plantilla para conferencias, workshops y gestión de eventos corporativos.',
    icon: CalendarDays,
    color: 'from-purple-500/5 to-purple-600/10',
    isComingSoon: true
  },
  {
    id: 'real-estate',
    title: 'Inmobiliaria',
    description: 'Plantilla para propiedades, listings y gestión inmobiliaria completa.',
    icon: Building,
    color: 'from-green-500/5 to-green-600/10',
    isComingSoon: true
  },
  {
    id: 'flexible-cms',
    title: 'Contenido Flexible',
    description: 'Crea tipos de contenido completamente personalizados con el CMS flexible.',
    icon: PlusCircle,
    color: 'from-indigo-500/5 to-purple-600/10',
    href: '/admin/dashboard/content-types'
  }
];
