import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth'; // Importamos nuestra instancia de auth

export async function GET(req: Request) {
    // La seguridad ya está manejada por el middleware de better-auth.
    // Si el código llega aquí, el usuario está autenticado y autorizado.
    
    try {
        const plans = await prisma.plan.findMany({
            include: {
                destination: true, // Incluir la información del destino
            },
            orderBy: {
                createdAt: 'desc', // Ordenar por fecha de creación descendente
            },
        });

        // Formatear los datos para que sean compatibles con la interfaz esperada
        const formattedPlans = plans.map(plan => ({
            id: plan.id,
            mainTitle: plan.mainTitle,
            destination: plan.destination?.name || plan.destination?.id || 'Sin destino',
            published: plan.published,
            createdAt: plan.createdAt,
            // Incluir otros campos si son necesarios
            articleAlias: plan.articleAlias,
            promotionalText: plan.promotionalText,
        }));

        return NextResponse.json({ success: true, plans: formattedPlans });

    } catch (error) {
        console.error('Error al obtener los planes:', error);
        return new NextResponse(
            JSON.stringify({ success: false, error: 'Error interno del servidor' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function POST(req: Request) {
    // La seguridad ya está manejada por el middleware.
    try {
        const data = await req.json();

        // Aquí podrías añadir una validación con Zod si quieres más seguridad.
        
        const newPlan = await prisma.plan.create({
            data: {
                ...data,
                // Asegúrate de que los campos JSON se guardan correctamente.
                // Prisma se encarga de esto si el tipo de dato en el schema es Json.
            },
        });

        return NextResponse.json({ success: true, plan: newPlan });

    } catch (error) {
        console.error('Error al crear el plan:', error);
        return new NextResponse(
            JSON.stringify({ success: false, error: 'Error interno del servidor' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
} 
