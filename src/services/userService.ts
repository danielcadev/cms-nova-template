// Servicio de gestión de usuarios de CMS Nova
import { AdminUser, CreateUserData, UpdateUserData } from '../types';

export const userService = {
  async getUsers(): Promise<AdminUser[]> {
    const response = await fetch('/api/admin/users');
    if (!response.ok) throw new Error('Error al obtener usuarios');
    return response.json();
  },

  async createUser(data: CreateUserData): Promise<AdminUser> {
    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al crear usuario');
    return response.json();
  },

  async updateUser(id: string, data: UpdateUserData): Promise<AdminUser> {
    const response = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al actualizar usuario');
    return response.json();
  },

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar usuario');
  }
}; 
