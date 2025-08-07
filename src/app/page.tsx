import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function HomePage() {
  const userCount = await prisma.user.count();

  if (userCount === 0) {
    redirect('/admin/signup');
  } else {
    redirect('/admin/login');
  }

  // Este return nunca se alcanzará debido a las redirecciones,
  // pero es bueno tenerlo por si la lógica cambia en el futuro.
  return null;
} 
