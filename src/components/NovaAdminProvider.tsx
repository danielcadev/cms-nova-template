'use client';

import React, { ReactNode } from 'react';
import { NovaConfig } from '../types';
import { AuthProvider } from '../contexts/AuthContext';

interface NovaAdminProviderProps {
  children: ReactNode;
  config: NovaConfig;
}

export function NovaAdminProvider({ children, config }: NovaAdminProviderProps) {
  return (
    <AuthProvider>
      <div className="nova-admin" data-theme={config.ui?.theme || 'light'}>
        {children}
      </div>
    </AuthProvider>
  );
} 
