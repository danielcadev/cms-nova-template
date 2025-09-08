import { DeleteObjectsCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { decrypt } from '@/lib/encryption'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { getAdminSession } from '@/lib/server-session'
import { ApiResponseBuilder as R } from '@/utils/api-response'
import logger from '@/utils/logger'

const schema = z.object({
  folder: z.string().default('uploads'),
  dryRun: z.boolean().default(true),
  max: z.number().int().positive().max(1000).default(200),
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
    logger.error('Error getting S3 config (media/cleanup):', error)
  }
  return null
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return R.error('Unauthorized', 401)

    const rl = rateLimit(req as unknown as Request, {
      limit: 10,
      windowMs: 60_000,
      key: 'media:cleanup:POST',
    })
    if (!rl.allowed) return R.error('Too many requests. Please try again later.', 429)

    const json = await req.json().catch(() => ({}))
    const parsed = schema.safeParse(json)
    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }))
      return R.validationError('Invalid data', errors)
    }

    const { folder, dryRun, max } = parsed.data
    const s3 = await getS3Config()
    if (!s3?.bucket || !s3?.accessKeyId || !s3?.secretAccessKey)
      return R.error('S3 is not configured', 400)

    const s3Client = new S3Client({
      region: s3.region,
      credentials: { accessKeyId: s3.accessKeyId, secretAccessKey: s3.secretAccessKey },
    })

    // 1) List S3 objects in folder
    const listRes = await s3Client.send(
      new ListObjectsV2Command({ Bucket: s3.bucket, Prefix: `${folder.replace(/^\/+/, '')}/` }),
    )

    const objects = (listRes.Contents || []).map((o) => o.Key!).filter(Boolean)

    // 2) Build a set of keys referenced by DB assets and by content (Plans mainImage)
    const assets = await prisma.asset.findMany({ where: { folder } })
    const assetKeys = new Set(assets.map((a) => a.key))

    const plans = await prisma.plan.findMany({ select: { id: true, mainImage: true } })
    for (const p of plans) {
      try {
        const json = p.mainImage as any
        if (json && typeof json === 'object' && json.key) assetKeys.add(String(json.key))
      } catch {}
    }

    // 3) Orphan keys: present in S3 but not referenced in DB/content
    const orphans = objects.filter((k) => !assetKeys.has(k)).slice(0, max)

    if (dryRun) {
      return R.success({ folder, totalListed: objects.length, orphans }, 'Dry run: orphans listed')
    }

    if (orphans.length === 0) return R.success({ folder, deleted: 0 }, 'No orphans to delete')

    const deleteRes = await s3Client.send(
      new DeleteObjectsCommand({
        Bucket: s3.bucket,
        Delete: { Objects: orphans.map((k) => ({ Key: k })) },
      }),
    )

    return R.success(
      { folder, deleted: deleteRes.Deleted?.length || 0, errors: deleteRes.Errors },
      'Cleanup executed',
    )
  } catch (error) {
    logger.error('media/cleanup: error', error)
    return R.error('Internal Server Error', 500)
  }
}
