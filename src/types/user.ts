// types/user.ts
export type UserRole = 'ADMIN' | 'USER';
export type UserStatus = 'active' | 'inactive';

// Tipos base para Better Auth
export interface BetterAuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  banned: boolean | null;
  banReason?: string | null;
  banExpires?: Date | null;
}

export interface BetterAuthSession {
  user: BetterAuthUser;
}

// Tipos para respuestas de Better Auth
export interface ErrorResponse {
  code?: string;
  message: string;
}

export interface SessionData {
  user: BetterAuthUser;
}

export interface BetterAuthResponse<T> {
  data: T | null;
  error: ErrorResponse | null;
}

// Definición del tipo GetSessionResponse
export interface GetSessionResponse {
  data: SessionData | null;
  error: ErrorResponse | null;
}

export interface UsersResponse {
  users: BetterAuthUser[];
}

export interface UserResponse {
  user: BetterAuthUser;
}

// Tipo transformado para el frontend
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  status: UserStatus;
  banned?: boolean;
  banReason?: string;
  banExpires?: Date;
}

// Tipos para operaciones
export interface UserUpdateParams {
  userId: string;
  role?: UserRole;
  status?: UserStatus;
}

// Tipos para componentes
export interface UsersTableProps {
  users: User[];
  onChangeRole: (userId: string, role: UserRole) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onToggleBan: (userId: string, shouldBan: boolean) => Promise<void>;
  currentUserEmail?: string;
}

// Tipos para queries
export interface UserQuery {
  filterField?: string;
  filterOperator?: 'eq' | 'contains' | 'starts_with' | 'ends_with';
  filterValue?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Tipos para operaciones específicas
export interface BanUserParams {
  userId: string;
  banReason?: string;
  banExpiresIn?: number;
}

export interface UpdateRoleParams {
  userId: string;
  role: UserRole;
}

export interface CreateUserParams {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

// Tipos para respuestas de operaciones
export interface SuccessResponse {
  success: boolean;
  error?: ErrorResponse;
}

// Tipos para opciones de sesión
export interface SessionOptions {
  expiresIn?: number;
  updateAge?: number;
  freshAge?: number;
}

export interface SessionQuery {
  disableCookieCache?: boolean;
}

// Tipos auxiliares para manejo de errores
export interface ApiError extends Error {
  code?: string;
  status?: number;
}

// Tipos para manejo de paginación
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Tipos para filtros
export interface FilterParams {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  startDate?: Date;
  endDate?: Date;
}

// Tipos para ordenamiento
export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

// Tipo utilitario para hacer campos requeridos
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

// Tipo utilitario para hacer campos opcionales
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
