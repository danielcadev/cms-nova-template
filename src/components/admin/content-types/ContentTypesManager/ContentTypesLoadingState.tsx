'use client';

import { Database } from 'lucide-react';

export function ContentTypesLoadingState() {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
      <div className="animate-pulse space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Database className="h-8 w-8 text-purple-600" />
          </div>
          <div className="h-4 bg-gray-200 rounded-lg w-32 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-200 rounded-lg w-24 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
