import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import type { GetSessionResponse, BetterAuthUser } from '@/types/user';

export function useCurrentUser() {
  const [user, setUser] = useState<BetterAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const session = await authClient.getSession() as GetSessionResponse;
        
        if (mounted) {
          setUser(session?.data?.user || null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error obteniendo usuario:', error);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };
    
    fetchUser();
    
    return () => {
      mounted = false;
    };
  }, []);

  return {
    user,
    isLoading,
    isAdmin: user?.role === 'ADMIN',
    userName: user?.name || 'Administrador'
  };
} 
