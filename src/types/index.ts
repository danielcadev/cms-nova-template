// ===============================================
// CMS Nova - Tipos Principales
// ===============================================

import { ReactNode } from 'react';

// --------- CONFIGURACIÓN PRINCIPAL ---------
export interface NovaConfig {
  auth: AuthConfig;
  database: DatabaseConfig;
  ui?: UIConfig;
  features?: NovaFeatures;
  permissions?: PermissionConfig;
  performance?: PerformanceConfig;
  security?: SecurityConfig;
  notifications?: NotificationConfig;
  seo?: SEOConfig;
}

export interface AuthConfig {
  secret: string;
  baseUrl?: string;
  adminRoles?: string[];
  sessionDuration?: number;
  requireEmailVerification?: boolean;
  allowRegistration?: boolean;
  maxLoginAttempts?: number;
  lockoutDuration?: number;
}

export interface DatabaseConfig {
  url: string;
  provider: 'postgresql' | 'mysql' | 'sqlite';
  connectionPoolSize?: number;
  queryTimeout?: number;
  enableLogging?: boolean;
}

export interface UIConfig {
  theme?: 'light' | 'dark' | 'auto';
  title?: string;
  description?: string;
  favicon?: string;
  logo?: string;
  primaryColor?: string;
  accentColor?: string;
  errorColor?: string;
  warningColor?: string;
  successColor?: string;
  fontFamily?: string;
  borderRadius?: string;
  customCSS?: string;
}

export interface NovaFeatures {
  users: boolean;
  plans: boolean;
  contentTypes?: boolean;
  headlessCMS?: boolean;
  templateSystem?: boolean;
  fileUpload?: boolean;
  imageOptimization?: boolean;
  analytics?: boolean;
  backup?: boolean;
  multiLanguage?: boolean;
  seo?: boolean;
  cache?: boolean;
  search?: boolean;
  fileManager?: boolean;
}

export interface PerformanceConfig {
  enableCache?: boolean;
  cacheStrategy?: 'memory' | 'redis' | 'database';
  cacheTTL?: number;
  enableImageOptimization?: boolean;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  enableGzip?: boolean;
}

export interface SecurityConfig {
  enableCSRF?: boolean;
  enableCORS?: boolean;
  allowedOrigins?: string[];
  enableRateLimiting?: boolean;
  rateLimitWindow?: number;
  rateLimitMaxRequests?: number;
  enableFileUploadSecurity?: boolean;
  maxRequestSize?: string;
}

export interface NotificationConfig {
  enableEmail?: boolean;
  emailProvider?: string;
  enablePush?: boolean;
  enableInApp?: boolean;
}

export interface SEOConfig {
  enableSitemap?: boolean;
  enableRobots?: boolean;
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
  enableOpenGraph?: boolean;
  enableTwitterCards?: boolean;
}

export interface PermissionConfig {
  customRoles?: string[];
  permissions?: Record<string, string[]>;
}

// --------- USUARIO ADMIN ---------
export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: string;
  emailVerified: boolean;
  banned?: boolean;
  banReason?: string;
  banExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  name?: string;
  password?: string;
  role?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
  banned?: boolean;
  banReason?: string;
}

// --------- PLAN/CONTENIDO ---------
export interface AdminPlan {
  id: string;
  mainTitle: string;
  articleAlias: string;
  categoryAlias: string;
  promotionalText: string;
  attractionsTitle: string;
  attractionsText: string;
  transfersTitle: string;
  transfersText: string;
  holidayTitle: string;
  holidayText: string;
  destination: string;
  includes: string;
  notIncludes: string;
  itinerary: PlanItinerary[];
  priceOptions: PlanPriceOption[];
  generalPolicies?: string;
  transportOptions: TransportOption[];
  allowGroundTransport: boolean;
  videoUrl?: string;
  mainImage?: PlanImage;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanItinerary {
  day: number;
  title: string;
  description: string;
  activities?: string[];
}

export interface PlanPriceOption {
  id: string;
  name: string;
  price: number;
  currency: string;
  description?: string;
  features?: string[];
}

export interface TransportOption {
  id: string;
  type: 'flight' | 'bus' | 'car' | 'train';
  name: string;
  description?: string;
  included: boolean;
}

export interface PlanImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

// --------- FORMULARIOS ---------
export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: Record<string, unknown>; // Zod schema or validation rules
}

// --------- AUTENTICACIÓN ---------
export interface AuthSession {
  user: AdminUser;
  token: string;
  expiresAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

// --------- RESPUESTAS API ---------
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --------- COMPONENTES ---------
export interface AdminLayoutProps {
  children: ReactNode;
  config: NovaConfig;
}

export interface DashboardStats {
  totalUsers: number;
  totalPlans: number;
  publishedPlans: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'user_created' | 'plan_created' | 'plan_published' | 'user_login';
  description: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
}

// --------- FILTROS Y BÚSQUEDA ---------
export interface UserFilters {
  role?: string;
  banned?: boolean;
  search?: string;
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PlanFilters {
  published?: boolean;
  category?: string;
  search?: string;
  sortBy?: 'title' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

// --------- HOOKS ---------
export interface UseUsersResult {
  users: AdminUser[];
  loading: boolean;
  error?: string;
  totalUsers: number;
  createUser: (data: CreateUserData) => Promise<void>;
  updateUser: (id: string, data: UpdateUserData) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

export interface UsePlansResult {
  plans: AdminPlan[];
  loading: boolean;
  error?: string;
  totalPlans: number;
  createPlan: (data: Partial<AdminPlan>) => Promise<void>;
  updatePlan: (id: string, data: Partial<AdminPlan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  refreshPlans: () => Promise<void>;
}

// --------- EVENTOS ---------
export type NovaEvent = 
  | { type: 'user_created'; data: AdminUser }
  | { type: 'user_updated'; data: AdminUser }
  | { type: 'user_deleted'; data: { id: string } }
  | { type: 'plan_created'; data: AdminPlan }
  | { type: 'plan_updated'; data: AdminPlan }
  | { type: 'plan_deleted'; data: { id: string } };

export interface NovaEventHandler {
  (event: NovaEvent): void;
} 
