'use client';

import { Users, Crown, Shield, Calendar, TrendingUp } from 'lucide-react';

interface UsersStatsProps {
  stats: {
    total: number;
    admins: number;
    verified: number;
    newThisMonth: number;
  };
}

export function UsersStats({ stats }: UsersStatsProps) {
  const statsData = [
    {
      title: "Total Usuarios",
      value: stats.total,
      icon: Users,
      gradient: "from-ios-primary to-ios-secondary",
      trend: { value: 12, direction: "up" as const }
    },
    {
      title: "Administradores",
      value: stats.admins,
      icon: Crown,
      gradient: "from-ios-warning to-ios-orange"
    },
    {
      title: "Verificados",
      value: stats.verified,
      icon: Shield,
      gradient: "from-ios-success to-ios-mint"
    },
    {
      title: "Nuevos Este Mes",
      value: stats.newThisMonth,
      icon: Calendar,
      gradient: "from-ios-purple to-ios-pink",
      trend: { value: 8, direction: "up" as const }
    }
  ];

  return (
    <div className="px-ios-2xl pb-ios-xl">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-ios-lg mb-ios-2xl">
          {statsData.map((stat, index) => (
            <div 
              key={stat.title}
              className="ios-glass rounded-ios-2xl p-ios-lg border border-white/20 shadow-ios ios-interactive"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'forwards'
              }}
            >
              <div className="flex items-center justify-between mb-ios">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-ios-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                {stat.trend && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-ios-success/10 rounded-ios text-ios-success">
                    <TrendingUp className="w-3 h-3" />
                    <span className="ios-caption font-sf-text font-semibold">+{stat.trend.value}%</span>
                  </div>
                )}
              </div>
              <div className="ios-title-2 font-sf-display text-black mb-1">{stat.value}</div>
              <div className="ios-subhead font-sf-text text-ios-gray-6">{stat.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}