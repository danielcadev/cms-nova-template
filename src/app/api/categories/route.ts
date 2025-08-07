import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Obtener todas las categorías únicas de los planes existentes
export async function GET() {
    try {
        const plans = await prisma.plan.findMany({
            select: { categoryAlias: true },
            where: { categoryAlias: { not: '' } }, // Excluir categorías vacías
            distinct: ['categoryAlias'],
            orderBy: { categoryAlias: 'asc' }
        });
        
        const categories = plans
            .map(plan => plan.categoryAlias)
            .filter(Boolean) // Remover nulls/undefined
            .map(categoryAlias => ({
                label: categoryAlias.charAt(0).toUpperCase() + categoryAlias.slice(1), // Capitalizar
                value: categoryAlias
            }));
        
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Error al obtener categorías' }), 
            { status: 500 }
        );
    }
}
