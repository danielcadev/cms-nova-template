// hooks/useCreateUser.ts
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useToast } from '@/hooks/use-toast';
import type { BetterAuthResponse, UserResponse } from '@/types/user';

interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

export function useCreateUser(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createUser = async (data: CreateUserData) => {
    setIsLoading(true);
    try {
      const response = await authClient.admin.createUser({
        email: data.email,
        password: data.password,
        name: data.name,
        role: 'user',
        data: {}
      }) as BetterAuthResponse<UserResponse>;

      if (response.error) {
        throw new Error(response.error.message || 'Error creating user');
      }

      toast({
        title: "Éxito",
        description: "Usuario creado correctamente"
      });

      onSuccess?.();
      return true;
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear el usuario",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createUser
  };
}
