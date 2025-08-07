// api/admin/check-first-admin/route.ts - Verificar si ya existe un administrador
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Verificar si existe al menos un usuario en la base de datos
    const userCount = await prisma.user.count();
    
    return NextResponse.json({ 
      hasAdmin: userCount > 0,
      userCount 
    });
  } catch (error) {
    console.error('Error checking admin:', error);
    
    // En caso de error (ej: base de datos no configurada), permitir el registro
    return NextResponse.json({ 
      hasAdmin: false,
      userCount: 0,
      error: 'Database not configured'
    });
  }
}
