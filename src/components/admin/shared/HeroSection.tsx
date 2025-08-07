import { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  label: string;
  color: string;
}

interface HeroSectionProps {
  badge: {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    color: string;
  };
  title: string;
  description: string;
  features?: Feature[];
  stats?: Array<{
    value: number | string;
    label: string;
    color: string;
  }>;
}

export function HeroSection({ badge, title, description, features, stats }: HeroSectionProps) {
  return (
    <div className="text-center max-w-4xl mx-auto">
      {/* Badge */}
      <div className={`inline-flex items-center gap-3 ${badge.color} backdrop-blur-sm px-8 py-4 rounded-3xl border border-white/30 mb-8 shadow-lg`}>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
          <badge.icon className="h-6 w-6 text-white" />
        </div>
        <div className="text-left">
          <h2 className="text-lg font-bold text-gray-900">{badge.title}</h2>
          <p className="text-sm text-gray-600">{badge.subtitle}</p>
        </div>
      </div>
      
      {/* Title */}
      <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-6 leading-tight">
        {title}
      </h1>
      
      {/* Description */}
      <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
        {description}
      </p>

      {/* Features */}
      {features && (
        <div className="flex items-center justify-center gap-8 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className={`w-12 h-12 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-sm text-gray-600 font-medium">{feature.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="flex items-center justify-center gap-8 mb-8">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-center">
                <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
              {index < stats.length - 1 && <div className="w-px h-12 bg-gray-200"></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
