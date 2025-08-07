import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const customHandler = async (req: Request) => {
  const url = new URL(req.url);

  // Solo aplicar esta lógica para la ruta de registro
  if (url.pathname.endsWith('/sign-up/email')) {
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return new Response(
        JSON.stringify({
          error: 'REGISTRATION_CLOSED',
          message: 'El registro está cerrado. Solo el primer usuario puede registrarse.',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }

  // Para todas las demás rutas de autenticación, usar el manejador por defecto
  return auth.handler(req);
};

export { customHandler as GET, customHandler as POST }; 