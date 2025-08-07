import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
export function useCurrentUser() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        let mounted = true;
        const fetchUser = async () => {
            try {
                const session = await authClient.getSession();
                if (mounted) {
                    setUser(session?.data?.user || null);
                    setIsLoading(false);
                }
            }
            catch (error) {
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
//# sourceMappingURL=use-current-user.js.map