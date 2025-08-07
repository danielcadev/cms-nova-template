// hooks/useAuth.ts
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { authClient } from '@/lib/auth-client';
import type { 
  GetSessionResponse, 
  SessionData, 
  BetterAuthResponse, 
  UserResponse 
} from '@/types/user';

interface LoginFormData {
  email: string;
  password: string;
}

// Función auxiliar para verificar si el usuario es admin
export function isAdminUser(session: SessionData | null): boolean {
  if (!session?.user) {
    return false;
  }
  
  const { role } = session.user;
  if (typeof role !== 'string') return false;
  
  return role.toLowerCase() === 'admin' || role.toLowerCase() === 'administrator';
}

export function useAuth() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Función para manejar el inicio de sesión
  const handleAuth = useCallback(async (formData: LoginFormData) => {
    setIsLoading(true);

    try {
      // Validar datos de entrada
      if (!formData.email || !formData.password) {
        throw new Error('Por favor, complete todos los campos');
      }
      
      if (!formData.email.includes('@')) {
        throw new Error('Por favor, ingrese un email válido');
      }

      console.log('🔐 Login para:', formData.email);
      
      // Intentar inicio de sesión
      const signInResponse = await authClient.signIn.email({
        email: formData.email,
        password: formData.password
      }) as BetterAuthResponse<UserResponse>;

      if (signInResponse.error) {
        throw new Error(signInResponse.error.message || 'Error al iniciar sesión');
      }

      console.log('✅ Login exitoso');

      // Esperar un momento para que se establezca la sesión
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar que sea admin
      const session = await authClient.getSession() as GetSessionResponse;
      
      if (session.error || !isAdminUser(session.data)) {
        await authClient.signOut();
        throw new Error('No tienes permisos de administrador');
      }

      toast({
        title: "✅ Bienvenido",
        description: "Acceso autorizado",
        variant: "default"
      });

      // Redirigir al dashboard
      router.replace('/admin/dashboard');

    } catch (error: unknown) {
      console.error('❌ Error en login:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
      
      toast({
        title: "❌ Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [router, toast]);

  // Función para manejar el cierre de sesión
  const handleLogout = useCallback(async () => {
    try {
      console.log('🚪 Cerrando sesión...');
      await authClient.signOut();
      
      toast({
        title: "Sesión cerrada",
        description: "Has salido del panel de administración",
        variant: "default"
      });
      
      router.push('/admin/login');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      
      toast({
        title: "Error",
        description: "Error al cerrar sesión",
        variant: "destructive"
      });
    }
  }, [toast, router]);

  return {
    isLoading,
    handleAuth,
    handleLogout
  };
}
