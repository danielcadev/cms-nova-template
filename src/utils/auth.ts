// utils/auth.ts
import { authClient } from '@/lib/auth-client';
import type { GetSessionResponse, SessionData } from '@/types/user';

export async function checkAdminSession(): Promise<boolean> {
  try {
    const response = await authClient.getSession() as GetSessionResponse;
    
    if (response.error || !response.data) {
      return false;
    }

    return response.data.user.role === 'ADMIN';
  } catch {
    return false;
  }
}

export async function getCurrentSession(): Promise<SessionData | null> {
  try {
    const response = await authClient.getSession() as GetSessionResponse;
    
    if (response.error || !response.data) {
      return null;
    }

    return response.data;
  } catch {
    return null;
  }
}
