'use client';

import React, { ReactNode, useState } from 'react';
import { Header } from './dashboard/Header';
import { Sidebar } from './dashboard/Sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-ios-gray-1">
      {/* Modern Background Effects */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-ios-gray-1 via-white/60 to-ios-gray-1/80" />
        
        {/* Subtle floating elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-ios-primary/8 to-transparent rounded-full blur-3xl animate-pulse opacity-60" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-ios-secondary/6 to-transparent rounded-full blur-3xl animate-pulse opacity-40" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-ios-success/5 to-transparent rounded-full blur-2xl animate-pulse opacity-30" style={{ animationDelay: '4s' }} />
      </div>

      {/* Modern Glassmorphism Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onToggle={toggleSidebar}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Main Content - Sin Header para diseño más limpio */}
        <main className="flex-1 relative">
          {/* Content with modern glassmorphism styling */}
          <div className="h-full">
            <div className="transition-all duration-300 ease-out">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 
