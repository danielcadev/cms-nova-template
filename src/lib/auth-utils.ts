// Utilidades de autenticación para CMS Nova
import { AdminUser } from '../types';

export function isAdminUser(user: AdminUser | null, adminRoles: string[] = ['ADMIN']): boolean {
  if (!user) return false;
  
  const userRole = user.role;
  if (typeof userRole !== 'string') return false;
  
  return adminRoles.some(role => 
    userRole.toLowerCase() === role.toLowerCase()
  );
}

export function hasPermission(
  user: AdminUser | null, 
  permission: string, 
  permissions?: Record<string, string[]>
): boolean {
  if (!user || !permissions) return false;
  
  const userPermissions = permissions[user.role];
  return userPermissions ? userPermissions.includes(permission) : false;
}

export function getUserDisplayName(user: AdminUser | null): string {
  if (!user) return 'Usuario';
  return user.name || user.email.split('@')[0] || 'Usuario';
}

export function getUserInitials(user: AdminUser | null): string {
  const name = getUserDisplayName(user);
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
} 
