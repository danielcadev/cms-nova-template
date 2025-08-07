// hooks/useUsers.ts
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/admin/user/adminService';
// Función de debounce para optimizar búsquedas
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}
export function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const { toast } = useToast();
    // Aplicar debounce al término de búsqueda para evitar búsquedas excesivas
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    // Cargar usuarios utilizando el servicio optimizado con manejo detallado de errores
    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const usersData = await adminService.listUsers();
            setUsers(usersData.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role || 'USER',
                emailVerified: user.emailVerified,
                createdAt: new Date(user.createdAt),
                updatedAt: new Date(user.updatedAt),
                status: user.banned ? 'inactive' : 'active'
            })));
        }
        catch (error) {
            console.error('Error en useUsers hook:', error);
            let errorMessage = "No se pudieron cargar los usuarios";
            if (error instanceof Error) {
                // Errores específicos de permisos
                if (error.message.includes('not allowed') || error.message.includes('FORBIDDEN')) {
                    errorMessage = "No tienes permisos para ver la lista de usuarios. Contacta al administrador.";
                }
                else {
                    errorMessage = error.message;
                }
            }
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
        }
        finally {
            setLoading(false);
        }
    }, [toast]);
    // Actualizar rol de usuario con memoización
    const updateUserRole = useCallback(async (userId, newRole) => {
        try {
            await adminService.updateUserRole(userId, newRole);
            setUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, role: newRole } : user));
            toast({
                title: "Éxito",
                description: "Rol actualizado correctamente"
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "No se pudo actualizar el rol";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
        }
    }, [toast]);
    // Cargar usuarios al montar el componente
    useEffect(() => {
        loadUsers();
    }, [loadUsers]);
    // Filtrar usuarios con useMemo para evitar recálculos innecesarios
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [users, debouncedSearchTerm, roleFilter]);
    return {
        users,
        loading,
        searchTerm,
        setSearchTerm,
        roleFilter,
        setRoleFilter,
        filteredUsers,
        updateUserRole,
        refreshUsers: loadUsers
    };
}
//# sourceMappingURL=use-users.js.map