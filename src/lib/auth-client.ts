// lib/auth-client.ts
import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";

// Función simplificada para obtener la URL base
const getBaseURL = () => {
  // En el cliente, usar la URL actual
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // En el servidor, usar fallback
  return process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3000';
};

export const authClient = createAuthClient({
    baseURL: getBaseURL(),
    plugins: [adminClient()],
    credentials: "include"
});
