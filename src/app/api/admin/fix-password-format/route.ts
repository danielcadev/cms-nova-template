import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: 'Email y nueva contraseña son requeridos' },
        { status: 400 }
      );
    }

    console.log(`🔧 Arreglando formato de contraseña para: ${email}`);

    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: {
          where: {
            providerId: 'credential'
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    if (!user.accounts[0]) {
      return NextResponse.json(
        { error: 'Cuenta credential no encontrada' },
        { status: 404 }
      );
    }

    // Obtener el contexto de Better Auth para usar su hasher
    const authContext = await auth.$context;
    
    // Hashear la nueva contraseña usando Better Auth (scrypt)
    const hashedPassword = await authContext.password.hash(newPassword);

    console.log('🔐 Nueva contraseña hasheada con Better Auth');

    // Actualizar tanto el usuario como la cuenta
    await prisma.$transaction(async (tx) => {
      // Actualizar la contraseña en el usuario
      await tx.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });

      // Actualizar la contraseña en la cuenta credential
      await tx.account.update({
        where: { id: user.accounts[0].id },
        data: { password: hashedPassword }
      });
    });

    console.log('✅ Contraseña actualizada correctamente');

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada con formato correcto',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('❌ Error arreglando formato de contraseña:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
