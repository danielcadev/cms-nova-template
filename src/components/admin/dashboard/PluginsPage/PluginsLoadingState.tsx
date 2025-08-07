'use client';

import { Puzzle, Loader2, Sparkles, Crown, Layers, Zap } from 'lucide-react';

export function PluginsLoadingState() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-slate-400/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-slate-400/10 to-blue-300/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Loading State */}
      <div className="text-center relative z-10">
        {/* Enhanced Loading Icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-slate-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
            <Puzzle className="h-12 w-12 text-white" />
          </div>
          
          {/* Rotating Ring */}
          <div className="absolute inset-0 rounded-3xl border-4 border-transparent border-t-blue-500/50 animate-spin" />
          
          {/* Sparkle Effect */}
          <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          
          {/* Crown Effect */}
          <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
            <Crown className="h-3 w-3 text-white" />
          </div>
        </div>
        
        {/* Enhanced Loading Text */}
        <div className="space-y-4 mb-10">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Cargando Plugins</h3>
          <p className="text-gray-600 dark:text-gray-400">Preparando las extensiones disponibles...</p>
        </div>
      </div>
    </div>
  );
}
