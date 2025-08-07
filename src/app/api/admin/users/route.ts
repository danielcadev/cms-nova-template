import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // La seguridad la maneja better-auth antes de llegar aquí.
        // Si el código llega a este punto, significa que el usuario está autorizado.
        const users = await prisma.user.findMany();

        // LOG DE DEPURACIÓN: ¿Qué nos devuelve Prisma realmente?
        console.log('USUARIOS OBTENIDOS DIRECTAMENTE DE PRISMA:', JSON.stringify(users, null, 2));

        return NextResponse.json({ users });

    } catch (error) {
        console.error('Error en /api/admin/users:', error);
        return new NextResponse(
            JSON.stringify({ message: 'Error interno del servidor' }),
            { status: 500 }
        );
    }
} 
