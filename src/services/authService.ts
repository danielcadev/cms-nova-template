// Servicio de autenticación de CMS Nova
import { authClient } from '../lib/auth-client';
import { LoginCredentials, AdminUser } from '../types';

export const authService = {
  async login(credentials: LoginCredentials) {
    return await authClient.signIn.email(credentials);
  },

  async logout() {
    return await authClient.signOut();
  },

  async getCurrentUser(): Promise<AdminUser | null> {
    const session = await authClient.getSession();
    return session?.data?.user as AdminUser || null;
  },

  async verifySession() {
    const session = await authClient.getSession();
    return session?.data || null;
  }
}; 
