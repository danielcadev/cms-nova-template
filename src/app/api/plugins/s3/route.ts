import { NextResponse } from 'next/server'
import { z } from 'zod'
import { encrypt } from '@/lib/encryption'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { getAdminSession } from '@/lib/server-session'
import { ApiResponseBuilder as R } from '@/utils/api-response'
import logger from '@/utils/logger'

const S3_CONFIG_KEY = 's3-credentials'

export async function GET(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) return R.error('Unauthorized', 401)

    const rl = rateLimit(request, { limit: 30, windowMs: 60_000, key: 'plugins:s3:GET' })
    if (!rl.allowed) return R.error('Too many requests. Please try again later.', 429)

    const s3Config = await prisma.novaConfig.findUnique({ where: { key: S3_CONFIG_KEY } })
    if (s3Config && typeof s3Config.value === 'object' && s3Config.value !== null) {
      const config = s3Config.value as any
      const safeConfig = {
        bucket: config.bucket,
        region: config.region,
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey ? '••••••••' : undefined,
      }
      return NextResponse.json({ success: true, config: safeConfig, source: 'database' })
    }

    const envConfig = {
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }

    if (envConfig.bucket && envConfig.accessKeyId && envConfig.secretAccessKey) {
      const safeEnvConfig = {
        bucket: envConfig.bucket,
        region: envConfig.region,
        accessKeyId: envConfig.accessKeyId,
        secretAccessKey: '••••••••',
      }
      return NextResponse.json({ success: true, config: safeEnvConfig, source: 'env' })
    }

    return NextResponse.json({ success: true, config: null })
  } catch (error) {
    logger.error('Error getting S3 configuration:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}

const s3ConfigSchema = z.object({
  bucket: z.string().min(1),
  region: z.string().min(1),
  accessKeyId: z.string().min(1),
  secretAccessKey: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const session = await getAdminSession()
    if (!session) return R.error('Unauthorized', 401)

    const rl = rateLimit(req, { limit: 10, windowMs: 60_000, key: 'plugins:s3:POST' })
    if (!rl.allowed) return R.error('Too many requests. Please try again later.', 429)

    const body = await req.json().catch(() => ({}))
    const parsed = s3ConfigSchema.safeParse(body)
    if (!parsed.success) {
      return R.validationError(
        'Invalid data',
        parsed.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
          code: e.code,
        })),
      )
    }

    const toStore = { ...parsed.data, secretAccessKey: encrypt(parsed.data.secretAccessKey) }

    const s3Config = await prisma.novaConfig.upsert({
      where: { key: S3_CONFIG_KEY },
      update: { value: toStore },
      create: { key: S3_CONFIG_KEY, value: toStore, category: 'plugin' },
    })

    const responseData = { ...s3Config, value: { ...parsed.data, secretAccessKey: '••••••••' } }
    return NextResponse.json({ success: true, config: responseData })
  } catch (error) {
    logger.error('Error saving S3 configuration:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
