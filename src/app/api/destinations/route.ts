import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { ApiResponseBuilder as R } from '@/utils/api-response'

// GET: Obtener todos los destinos
export async function GET(request: Request) {
  try {
    const rl = rateLimit(request, { limit: 60, windowMs: 60_000, key: 'destinations:GET' })
    if (!rl.allowed) return R.error('Too many requests. Please try again later.', 429)

    const destinations = await prisma.destination.findMany({ orderBy: { name: 'asc' } })
    // Legacy shape compatibility: return array directly as before
    return NextResponse.json(destinations)
  } catch (_error) {
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}

const destSchema = z.object({ name: z.string().min(1) })

// POST: Crear un nuevo destino
import { getAdminSession } from '@/lib/server-session'
export async function POST(req: Request) {
  try {
    const session = await getAdminSession()
    if (!session) return R.error('Unauthorized', 401)

    const rl = rateLimit(req, { limit: 20, windowMs: 60_000, key: 'destinations:POST' })
    if (!rl.allowed) return R.error('Too many requests. Please try again later.', 429)

    const body = await req.json().catch(() => ({}))
    const parsed = destSchema.safeParse(body)
    if (!parsed.success) {
      return R.validationError(
        'Invalid data',
        parsed.error.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
          code: e.code,
        })),
      )
    }

    const newDestination = await prisma.destination.create({ data: { name: parsed.data.name } })
    return NextResponse.json(newDestination, { status: 201 })
  } catch (_error) {
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error while creating destination' }),
      { status: 500 },
    )
  }
}
