import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Obtener todos los destinos
export async function GET() {
    try {
        const destinations = await prisma.destination.findMany({
            orderBy: { name: 'asc' },
        });
        return NextResponse.json(destinations);
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Error al obtener destinos' }), { status: 500 });
    }
}

// POST: Crear un nuevo destino
export async function POST(req: Request) {
    try {
        const { name } = await req.json();
        if (!name) {
            return new NextResponse(JSON.stringify({ error: 'El nombre es requerido' }), { status: 400 });
        }
        const newDestination = await prisma.destination.create({
            data: { name },
        });
        return NextResponse.json(newDestination, { status: 201 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Error al crear destino' }), { status: 500 });
    }
} 
