'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { authClient } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';
import type { 
  GetSessionResponse, 
  SessionData, 
  BetterAuthResponse, 
  UserResponse,
  BetterAuthUser 
} from '@/types/user';

interface LoginFormData {
  email: string;
  password: string;
}

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean | null;
  user: BetterAuthUser | null;
  handleAuth: (formData: LoginFormData) => Promise<void>;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función auxiliar para verificar si el usuario es admin - EXPORTADA
export function isAdminUser(session: SessionData | null): boolean {
  if (!session?.user) {
    return false;
  }
  
  const { role } = session.user;
  if (typeof role !== 'string') return false;
  
  return role.toLowerCase() === 'admin' || role.toLowerCase() === 'administrator';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<BetterAuthUser | null>(null);

  const isLoginPage = pathname === '/admin/login';

  // Función centralizada para verificar sesión
  const checkSession = useCallback(async () => {
    try {
      console.log('🔍 AuthContext: Verificando sesión...');
      
      const session = await authClient.getSession() as GetSessionResponse;
      
      console.log('📊 AuthContext: Respuesta de sesión:', {
        hasError: !!session.error,
        hasData: !!session.data,
        hasUser: !!session.data?.user,
        userRole: session.data?.user?.role,
        userEmail: session.data?.user?.email
      });
      
      if (session.error) {
        console.log('❌ AuthContext: Error en sesión:', session.error);
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
      
      // Verificar si es administrador
      const isAdmin = isAdminUser(session.data);
      console.log('✅ AuthContext: Resultado verificación admin:', { 
        isAdmin, 
        userRole: session.data?.user?.role,
        userEmail: session.data?.user?.email 
      });
      
      setUser(session.data?.user || null);
      setIsAuthenticated(isAdmin);
      return isAdmin;
    } catch (error) {
      console.error('❌ AuthContext: Error al verificar sesión:', error);
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  // Verificación inicial al montar
  useEffect(() => {
    let mounted = true;
    
    const initialCheck = async () => {
      console.log('🚀 AuthContext: Verificación inicial...');
      
      await checkSession();
      
      if (mounted) {
        setIsLoading(false);
      }
    };
    
    initialCheck();
    
    return () => {
      mounted = false;
    };
  }, [checkSession]);

  // Manejar redirección cuando no está autenticado
  useEffect(() => {
    if (!isLoading && isAuthenticated === false && !isLoginPage) {
      console.log('🔄 AuthContext: Usuario no autenticado, redirigiendo a login...');
      router.replace('/admin/login');
    }
  }, [isAuthenticated, isLoading, isLoginPage, router]);

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

      console.log('🔐 AuthContext: Intentando login para:', formData.email);
      
      // Intentar inicio de sesión
      const signInResponse = await authClient.signIn.email({
        email: formData.email,
        password: formData.password
      }) as BetterAuthResponse<UserResponse>;

      if (signInResponse.error) {
        throw new Error(signInResponse.error.message || 'Error al iniciar sesión');
      }

      console.log('✅ AuthContext: Login exitoso, verificando permisos...');

      // Esperar un momento para que se establezca la sesión
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar sesión después del login
      const isAdmin = await checkSession();
      
      if (!isAdmin) {
        console.log('❌ AuthContext: Usuario no es admin, cerrando sesión...');
        await authClient.signOut();
        throw new Error('No tienes permisos de administrador');
      }

      console.log('✅ AuthContext: Usuario admin verificado');

      toast({
        title: "✅ Bienvenido",
        description: "Acceso autorizado",
        variant: "default"
      });

      // Redirigir al dashboard
      console.log('🔄 AuthContext: Redirigiendo a dashboard...');
      router.replace('/admin/dashboard');

    } catch (error: unknown) {
      console.error('❌ AuthContext: Error en handleAuth:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
      
      toast({
        title: "❌ Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [router, toast, checkSession]);

  // Función para manejar el cierre de sesión
  const handleLogout = useCallback(async () => {
    try {
      console.log('🚪 AuthContext: Cerrando sesión...');
      await authClient.signOut();
      
      // Resetear estados
      setUser(null);
      setIsAuthenticated(false);
      
      toast({
        title: "Sesión cerrada",
        description: "Has salido del panel de administración",
        variant: "default"
      });
      
      router.push('/admin/login');
    } catch (error) {
      console.error('❌ AuthContext: Error al cerrar sesión:', error);
      
      toast({
        title: "Error",
        description: "Error al cerrar sesión",
        variant: "destructive"
      });
    }
  }, [toast, router]);

  const value = {
    isLoading,
    isAuthenticated,
    user,
    handleAuth,
    handleLogout
  };

  // Mostrar loading solo cuando NO estamos en la página de login y estamos verificando
  if (isLoading && !isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          <p className="text-gray-600 font-medium">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext debe usarse dentro de un AuthProvider');
  }
  return context;
} 
