// hooks/useUsersTable.ts
import { useState, useCallback, useMemo } from 'react';
import type { User, UserRole } from "@/types/user";

interface UseUsersTableProps {
  users: User[];
  onChangeRole: (userId: string, newRole: UserRole) => Promise<void>;
}

export function useUsersTable({ users, onChangeRole }: UseUsersTableProps) {
  const [userToChange, setUserToChange] = useState<{ 
    id: string; 
    role: UserRole; 
    name: string; 
    isFirstAdmin: boolean 
  } | null>(null);

  // Identificar al primer admin (el usuario admin más antiguo) con memoización
  const firstAdmin = useMemo(() => {
    return users
      .filter(user => user.role === 'ADMIN')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0];
  }, [users]);

  // Memoizar la función para evitar recreaciones innecesarias
  const handleRoleChange = useCallback((user: User) => {
    const isFirstAdmin = user.id === firstAdmin?.id;
    setUserToChange({ 
      id: user.id, 
      role: user.role, 
      name: user.name,
      isFirstAdmin
    });
  }, [firstAdmin]);

  // Memoizar la función para evitar recreaciones innecesarias
  const confirmRoleChange = useCallback(async () => {
    if (userToChange && !userToChange.isFirstAdmin) {
      const newRole: UserRole = userToChange.role === 'ADMIN' ? 'USER' : 'ADMIN';
      await onChangeRole(userToChange.id, newRole);
      setUserToChange(null);
    }
  }, [userToChange, onChangeRole]);

  return {
    userToChange,
    setUserToChange,
    firstAdmin,
    handleRoleChange,
    confirmRoleChange
  };
}
