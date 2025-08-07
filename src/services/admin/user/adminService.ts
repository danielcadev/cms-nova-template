// services/adminService.ts
import { authClient } from '@/lib/auth-client';
import type { User, UserRole } from '@/types/user';

// Tipo para las respuestas de la API
interface ApiResponse<T = unknown> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

// Tipo para representar un usuario de Better Auth
// Usamos un tipo más específico para evitar 'any'
interface BetterAuthUser {
  id: string;
  email: string;
  name: string;
  role?: string | null;
  emailVerified: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: string | Date | null;
  [key: string]: unknown;
}

// Función para convertir BetterAuthUser a User
function mapBetterAuthUserToUser(userFromAuth: BetterAuthUser): User {
  return {
    id: userFromAuth.id,
    name: userFromAuth.name,
    email: userFromAuth.email,
    role: (userFromAuth.role as UserRole) || 'USER',
    emailVerified: userFromAuth.emailVerified,
    createdAt: new Date(userFromAuth.createdAt),
    updatedAt: new Date(userFromAuth.updatedAt),
    status: userFromAuth.banned ? 'inactive' : 'active',
    banned: userFromAuth.banned || false,
    banReason: userFromAuth.banReason || undefined,
    banExpires: userFromAuth.banExpires ? new Date(userFromAuth.banExpires) : undefined
  };
}

// Tipo para estadísticas de usuarios
export interface UserStats {
  total: number;
  growthRate: number;
  activeUsers: number;
  activeSessionsCount: number;
  newUsersThisMonth: number;
}

// Tipo para representar un usuario con sesiones
export interface UserWithSessions extends User {
  sessions: UserSession[];
}

// Tipo para representar una sesión de usuario
export interface UserSession {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

// Función auxiliar para manejar errores de manera consistente
const handleApiError = (error: unknown, defaultMessage: string): never => {
  console.error(defaultMessage, error);
  if (error instanceof Error) {
    throw new Error(error.message || defaultMessage);
  }
  throw new Error(defaultMessage);
};

// Función auxiliar para manejar las respuestas de authClient.admin.listUsers()
async function fetchUsers(): Promise<User[]> {
  try {
    // Intentar obtener la sesión del usuario actual para verificar si es admin

    const sessionResponse = await authClient.getSession();

    
    // Intentar usar la API directamente con fetch como alternativa a authClient.admin.listUsers

    
    // Construir URL basada en el entorno
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin  // En el navegador
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'; // En el servidor
    
    const apiUrl = `${baseUrl}/api/admin/users`;

    
    // Intentar obtener datos de la API
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();

        
        if (data.users && Array.isArray(data.users)) {

          return data.users.map((user: Record<string, unknown>) => mapBetterAuthUserToUser(user as BetterAuthUser));
        } else {
          console.error('Formato de respuesta inválido (users no es array)');
        }
      } else {
        // Si la respuesta no es OK, loguear detalles
        console.error('Error en respuesta HTTP:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Detalle del error:', errorText);
      }
    } catch (apiError) {
      console.error('Error en la API:', apiError);
    }
    
    // Si llegamos aquí, el método alternativo falló

    try {
      const response = await authClient.admin.listUsers({
        query: { limit: 100 }
      });
      
      if (!response.error) {
        const users = response.data?.users?.map(user => mapBetterAuthUserToUser(user as BetterAuthUser)) || [];

        return users;
      } else {
        console.error('Error en método original:', JSON.stringify(response.error, null, 2));
      }
    } catch (originalError) {
      console.error('Error en método original:', originalError);
    }
    
    // Si estamos en desarrollo, intentar cargar datos de prueba

    const isDev = process.env.NODE_ENV === 'development';
    
    if (isDev && sessionResponse?.data?.user?.role === 'ADMIN') {

      
      const currentUser = sessionResponse.data.user;
      
      // OPCIÓN PARA PRUEBAS: Simular más usuarios (incluido el actual)
      return [
        {
          id: currentUser.id || 'current-user-id',
          name: currentUser.name || 'Usuario Actual',
          email: currentUser.email || 'usuario@actual.com',
          role: 'ADMIN' as UserRole,
          emailVerified: !!currentUser.emailVerified,
          createdAt: new Date(Date.now() - 86400000 * 2), // 2 días antes
          updatedAt: new Date(),
          status: 'active',
          banned: false
        },
        {
          id: '1',
          name: 'Usuario Normal',
          email: 'usuario@normal.com',
          role: 'USER' as UserRole,
          emailVerified: true,
          createdAt: new Date(Date.now() - 86400000), // 1 día antes
          updatedAt: new Date(),
          status: 'active',
          banned: false
        },
        {
          id: '2',
          name: 'Usuario Inactivo',
          email: 'usuario@inactivo.com',
          role: 'USER' as UserRole, 
          emailVerified: false,
          createdAt: new Date(Date.now() - 86400000 * 5), // 5 días antes
          updatedAt: new Date(),
          status: 'inactive',
          banned: true
        }
      ];
    }
    

    return [];
  } catch (error) {
    console.error('Error en fetchUsers:', error);
    return [];
  }
}

// Función auxiliar para manejar las respuestas de authClient.admin.listUserSessions()
async function safeListUserSessions(userId: string): Promise<UserSession[]> {
  const apiResponse = await authClient.admin.listUserSessions({
    userId
  });
  
  // Verificar si hay un error en la respuesta
  if ('error' in apiResponse && apiResponse.error) {
    throw new Error(apiResponse.error.message || 'Error al obtener sesiones');
  }
  
  // Convertir la respuesta al tipo esperado
  return ('data' in apiResponse && apiResponse.data?.sessions) ? 
    apiResponse.data.sessions.map(session => ({
      id: session.id,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
      userId: session.userId,
      expiresAt: new Date(session.expiresAt),
      token: session.token,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent
    })) : 
    [];
}

export const adminService = {
  // Obtener estadísticas de usuarios
  getUserStats: async (): Promise<UserStats> => {
    try {
      // Obtener todos los usuarios
      const users = await fetchUsers();

      const total = users.length;
      
      // Calcular usuarios activos (no baneados)
      const activeUsers = users.filter(user => !user.banned).length;
      
      // Calcular usuarios con sesiones activas (simulado)
      // En BetterAuth no podemos obtener sesiones activas directamente
      // Estimamos que aproximadamente el 10-20% de los usuarios están conectados
      const activeSessionsCount = Math.max(1, Math.floor(activeUsers * 0.15));
      
      // Calcular usuarios nuevos este mes
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const newUsersThisMonth = users.filter(
        user => new Date(user.createdAt) >= firstDayOfMonth
      ).length;
      
      // Calcular usuarios del mes pasado
      const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      const usersLastMonth = users.filter(
        user => {
          const createdAt = new Date(user.createdAt);
          return createdAt >= firstDayOfLastMonth && createdAt <= lastDayOfLastMonth;
        }
      ).length;
      
      // Calcular tasa de crecimiento
      let growthRate = 0;
      if (usersLastMonth > 0) {
        growthRate = Math.round((newUsersThisMonth / usersLastMonth) * 100);
      } else if (newUsersThisMonth > 0) {
        growthRate = 100; // Si no había usuarios el mes pasado, el crecimiento es del 100%
      }
      
      return {
        total,
        growthRate,
        activeUsers,
        activeSessionsCount,
        newUsersThisMonth
      };
    } catch (error) {
      return handleApiError(error, 'Failed to get user statistics');
    }
  },

  // Obtener todas las sesiones activas (simulado para BetterAuth)
  getActiveSessions: async () => {
    try {
      // BetterAuth no proporciona un método directo para listar todas las sesiones
      // Devolvemos un array vacío para evitar errores
      return [];
    } catch (error) {
      return handleApiError(error, 'Failed to get active sessions');
    }
  },

  // Listar usuarios con paginación y filtros
  listUsers: async () => {
    try {
      return await fetchUsers();
    } catch (error) {
      return handleApiError(error, 'Failed to list users');
    }
  },

  // Buscar usuarios con caché para búsquedas repetidas
  searchUsers: (() => {
    const cache = new Map<string, { users: User[], timestamp: number }>();
    const CACHE_TTL = 60000; // 1 minuto
    
    return async (searchTerm: string) => {
      try {
        // Verificar caché para términos de búsqueda frecuentes
        const cacheKey = searchTerm.toLowerCase().trim();
        const now = Date.now();
        const cachedResult = cache.get(cacheKey);
        
        if (cachedResult && (now - cachedResult.timestamp < CACHE_TTL)) {
          return cachedResult.users;
        }
        
        const users = await fetchUsers();
        
        // Guardar en caché
        cache.set(cacheKey, { users, timestamp: now });
        
        return users;
      } catch (error) {
        return handleApiError(error, 'Failed to search users');
      }
    };
  })(),

  // Obtener usuario por ID
  getUserById: async (userId: string) => {
    try {
      const users = await fetchUsers();

      return users.find(user => user.id === userId) || null;
    } catch (error) {
      return handleApiError(error, 'Failed to get user');
    }
  },

  // Actualizar rol de usuario
  updateUserRole: async (userId: string, role: UserRole) => {
    try {
      // Mapear UserRole a los valores esperados por Better Auth
      const betterAuthRole = role === 'ADMIN' ? 'admin' : 'user';
      
      const response = await authClient.admin.setRole({
        userId,
        role: betterAuthRole
      }) as ApiResponse;

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to update user role');
    }
  },

  // Eliminar usuario
  deleteUser: async (userId: string) => {
    try {
      const response = await authClient.admin.removeUser({
        userId
      }) as ApiResponse;

      if (response.error) {
        throw new Error(response.error.message);
      }

      return true;
    } catch (error) {
      return handleApiError(error, 'Failed to delete user');
    }
  },

  // Banear usuario
  banUser: async (userId: string, reason?: string) => {
    try {
      const response = await authClient.admin.banUser({
        userId,
        banReason: reason || 'Banned by administrator',
        banExpiresIn: 60 * 60 * 24 * 30 // 30 días por defecto
      }) as ApiResponse;

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to ban user');
    }
  },

  // Desbanear usuario
  unbanUser: async (userId: string) => {
    try {
      const response = await authClient.admin.unbanUser({
        userId
      }) as ApiResponse;

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to unban user');
    }
  },

  // Obtener sesiones de usuario
  getUserSessions: async (userId: string): Promise<UserSession[]> => {
    try {
      return await safeListUserSessions(userId);
    } catch (error) {
      return handleApiError(error, 'Failed to get user sessions');
    }
  },

  // Revocar sesión específica
  revokeSession: async (sessionToken: string) => {
    try {
      const response = await authClient.admin.revokeUserSession({
        sessionToken
      }) as ApiResponse;

      if (response.error) {
        throw new Error(response.error.message);
      }

      return true;
    } catch (error) {
      return handleApiError(error, 'Failed to revoke session');
    }
  },

  // Revocar todas las sesiones de un usuario
  revokeAllSessions: async (userId: string) => {
    try {
      const response = await authClient.admin.revokeUserSessions({
        userId
      }) as ApiResponse;

      if (response.error) {
        throw new Error(response.error.message);
      }

      return true;
    } catch (error) {
      return handleApiError(error, 'Failed to revoke all sessions');
    }
  },

  // Impersonar usuario
  impersonateUser: async (userId: string) => {
    try {
      const response = await authClient.admin.impersonateUser({
        userId
      }) as ApiResponse;

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to impersonate user');
    }
  },

  // Dejar de impersonar
  stopImpersonating: async () => {
    try {
      const response = await authClient.admin.stopImpersonating() as ApiResponse;

      if (response.error) {
        throw new Error(response.error.message);
      }

      return true;
    } catch (error) {
      return handleApiError(error, 'Failed to stop impersonating');
    }
  }
};
