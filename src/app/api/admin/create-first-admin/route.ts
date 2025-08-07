// api/admin/create-first-admin/route.ts - Crear el primer administrador
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validar que los campos requeridos estén presentes
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que no exista ya un administrador
    const existingUserCount = await prisma.user.count();
    if (existingUserCount > 0) {
      return NextResponse.json(
        { error: 'Ya existe un administrador. El registro está deshabilitado.' },
        { status: 403 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El formato del email no es válido' },
        { status: 400 }
      );
    }

    // Validar longitud de contraseña
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

    // Verificar que el email no esté ya registrado (por si acaso)
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 409 }
      );
    }

    // Obtener el contexto de Better Auth para usar su hasher (scrypt)
    const authContext = await auth.$context;
    const hashedPassword = await authContext.password.hash(password);

    // Crear el primer administrador usando una transacción para asegurar consistencia
    const admin = await prisma.$transaction(async (tx) => {
      // Crear el usuario
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'ADMIN',
          emailVerified: new Date(),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      });

      // Crear la cuenta credential necesaria para Better Auth
      await tx.account.create({
        data: {
          userId: newUser.id,
          accountId: newUser.id,
          providerId: 'credential',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      });

      return newUser;
    });

    return NextResponse.json({
      success: true,
      message: 'Administrador creado exitosamente',
      admin
    });

  } catch (error) {
    console.error('Error creating first admin:', error);
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
