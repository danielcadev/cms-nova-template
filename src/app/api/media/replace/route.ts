import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { decrypt } from '@/lib/encryption'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { getAdminSession } from '@/lib/server-session'
import { ApiResponseBuilder as R } from '@/utils/api-response'
import logger from '@/utils/logger'

const schema = z.object({
  // New asset
  key: z.string().min(1),
  url: z.string().url(),
  mimeType: z.string().min(1),
  size: z.number().int().nonnegative(),
  folder: z.string().default('uploads'),
  title: z.string().optional().nullable(),
  alt: z.string().optional().nullable(),
  width: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
  // Previous asset to remove
  previousKey: z.string().min(1),
})

async function getS3Config() {
  try {
    const S3_CONFIG_KEY = 's3-credentials'
    const s3Config = await prisma.novaConfig.findUnique({ where: { key: S3_CONFIG_KEY } })
    if (s3Config && typeof s3Config.value === 'object' && s3Config.value !== null) {
      const cfg = s3Config.value as any
      return {
        bucket: cfg.bucket as string,
        region: (cfg.region as string) || 'us-east-1',
        accessKeyId: cfg.accessKeyId as string,
        secretAccessKey: cfg.secretAccessKey ? (decrypt(cfg.secretAccessKey) as string) : undefined,
      }
    }
    const envConfig = {
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
    if (envConfig.bucket && envConfig.accessKeyId && envConfig.secretAccessKey) return envConfig
  } catch (error) {
    logger.error('Error getting S3 config (media/replace):', error)
  }
  return null
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return R.error('Unauthorized', 401)

    const rl = rateLimit(req as unknown as Request, {
      limit: 20,
      windowMs: 60_000,
      key: 'media:replace:POST',
    })
    if (!rl.allowed) return R.error('Too many requests. Please try again later.', 429)

    const json = await req.json().catch(() => ({}))
    const parsed = schema.safeParse(json)
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

    const { key, url, mimeType, size, folder, title, alt, width, height, previousKey } = parsed.data

    // Upsert new asset first
    const item = await prisma.asset.upsert({
      where: { key },
      update: {
        url,
        mimeType,
        size,
        folder,
        title: title ?? null,
        alt: alt ?? null,
        width: width ?? null,
        height: height ?? null,
      },
      create: {
        key,
        url,
        mimeType,
        size,
        folder,
        title: title ?? null,
        alt: alt ?? null,
        width: width ?? null,
        height: height ?? null,
      },
    })

    if (previousKey && previousKey !== key) {
      // Delete previous from S3 and DB
      try {
        const s3 = await getS3Config()
        if (s3?.bucket && s3?.accessKeyId && s3?.secretAccessKey) {
          const s3Client = new S3Client({
            region: s3.region,
            credentials: { accessKeyId: s3.accessKeyId, secretAccessKey: s3.secretAccessKey },
          })
          await s3Client.send(new DeleteObjectCommand({ Bucket: s3.bucket, Key: previousKey }))
        }
        await prisma.asset.delete({ where: { key: previousKey } }).catch(() => undefined)
      } catch (e) {
        logger.warn('media/replace: failed to delete previous', { previousKey, error: e })
      }
    }

    return R.success(item, 'Asset replaced successfully')
  } catch (error) {
    logger.error('media/replace: error', error)
    return R.error('Internal Server Error', 500)
  }
}
