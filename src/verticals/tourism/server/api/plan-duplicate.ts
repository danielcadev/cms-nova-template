import { CopyObjectCommand, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3'
import type { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { decrypt } from '@/lib/encryption'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { isRequestAdmin } from '@/server/auth/guards'
import logger from '@/server/observability/logger'
import { ApiResponseBuilder as R } from '@/utils/api-response'

function buildDuplicateAlias(baseAlias: string, suffix: string) {
  const MAX = 100
  const cleanBase = (baseAlias || 'plan').trim()
  const trimmedBase = cleanBase.slice(0, Math.max(1, MAX - suffix.length))
  return `${trimmedBase}${suffix}`.slice(0, MAX)
}

const S3_CONFIG_KEY = 's3-credentials'

async function getS3Config() {
  try {
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
  } catch (error) {
    logger.warn('plan-duplicate: failed to load S3 config from DB', error)
  }

  const envConfig = {
    bucket: process.env.AWS_S3_BUCKET,
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
  if (envConfig.bucket && envConfig.accessKeyId && envConfig.secretAccessKey) return envConfig
  return null
}

function extractKeyFromUrl(url: string): string | null {
  try {
    const u = new URL(url)
    const key = u.pathname?.startsWith('/') ? u.pathname.slice(1) : u.pathname
    return key || null
  } catch {
    return null
  }
}

function isLikelyS3PublicUrl(url: string, bucket: string): boolean {
  try {
    const u = new URL(url)
    if (!u.hostname) return false
    if (!u.hostname.startsWith(`${bucket}.s3`)) return false
    if (!u.hostname.includes('amazonaws.com')) return false
    return true
  } catch {
    return false
  }
}

function encodeCopySource(bucket: string, key: string) {
  const encoded = encodeURIComponent(key).replace(/%2F/g, '/')
  return `${bucket}/${encoded}`
}

function deriveDestinationKey(opts: {
  sourceKey: string
  oldSlug: string
  newSlug: string
}): string {
  const { sourceKey, oldSlug, newSlug } = opts
  const oldPrefix = `plans/${oldSlug}/`
  const newPrefix = `plans/${newSlug}/`

  if (sourceKey.startsWith(oldPrefix)) {
    return `${newPrefix}${sourceKey.slice(oldPrefix.length)}`
  }

  const filename = sourceKey.split('/').pop() || 'asset'
  return `${newPrefix}imports/${filename}`
}

async function cloneS3Object(opts: {
  s3: { bucket: string; region: string; accessKeyId: string; secretAccessKey: string }
  sourceKey: string
  destKey: string
}) {
  const { s3, sourceKey, destKey } = opts
  const client = new S3Client({
    region: s3.region,
    credentials: { accessKeyId: s3.accessKeyId, secretAccessKey: s3.secretAccessKey },
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  })

  await client.send(
    new CopyObjectCommand({
      Bucket: s3.bucket,
      Key: destKey,
      CopySource: encodeCopySource(s3.bucket, sourceKey),
      MetadataDirective: 'COPY',
    }),
  )

  const head = await client.send(new HeadObjectCommand({ Bucket: s3.bucket, Key: destKey }))
  const url = `https://${s3.bucket}.s3.${s3.region}.amazonaws.com/${destKey}`

  // Best-effort asset record for Media Browser.
  try {
    const folder = destKey.includes('/') ? destKey.split('/').slice(0, -1).join('/') : 'uploads'
    await prisma.asset.upsert({
      where: { key: destKey },
      update: {
        url,
        mimeType: head.ContentType || 'application/octet-stream',
        size: Number(head.ContentLength || 0),
        folder,
      },
      create: {
        key: destKey,
        url,
        mimeType: head.ContentType || 'application/octet-stream',
        size: Number(head.ContentLength || 0),
        folder,
      },
    })
  } catch (error) {
    logger.warn('plan-duplicate: failed to upsert asset record', { destKey, error })
  }

  return { key: destKey, url }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  try {
    const isAdmin = await isRequestAdmin(request)
    if (!isAdmin) return R.unauthorized('Unauthorized')

    const rl = rateLimit(request, { limit: 10, windowMs: 60_000, key: `plans:${id}:DUPLICATE` })
    if (!rl.allowed) return R.error('Too many requests. Please try again later.', 429)

    const existing = await prisma.plan.findUnique({ where: { id } })
    if (!existing) return R.notFound('Plan not found')

    const itinerary = Array.isArray(existing.itinerary) ? existing.itinerary : []
    const priceOptions = Array.isArray(existing.priceOptions) ? existing.priceOptions : []
    const transportOptions = Array.isArray(existing.transportOptions)
      ? existing.transportOptions
      : []

    const s3Config = await getS3Config()
    const canCloneAssets = Boolean(
      s3Config?.bucket && s3Config?.region && s3Config?.accessKeyId && s3Config?.secretAccessKey,
    )

    const copyToken = Date.now().toString(36)
    const baseSuffix = `-copy-${copyToken}`

    let articleAlias = buildDuplicateAlias(existing.articleAlias, baseSuffix)
    let tries = 0
    while (tries < 10) {
      const found = await prisma.plan.findUnique({ where: { articleAlias } })
      if (!found) break
      tries += 1
      articleAlias = buildDuplicateAlias(existing.articleAlias, `${baseSuffix}-${tries}`)
    }

    const oldSlug = existing.articleAlias
    const newSlug = articleAlias

    let nextMainImage = existing.mainImage as any
    const nextItinerary = itinerary.map((d: any) => ({ ...(d || {}) }))

    if (canCloneAssets) {
      const s3 = s3Config as {
        bucket: string
        region: string
        accessKeyId: string
        secretAccessKey: string
      }

      // Clone main image (if present)
      try {
        let sourceKey: string | null = null
        if (typeof nextMainImage === 'object' && nextMainImage) {
          sourceKey = (nextMainImage.key as string | undefined) || null
          if (!sourceKey && typeof nextMainImage.url === 'string') {
            if (isLikelyS3PublicUrl(nextMainImage.url, s3.bucket)) {
              sourceKey = extractKeyFromUrl(nextMainImage.url)
            }
          }
        }

        if (sourceKey) {
          const destKey = deriveDestinationKey({ sourceKey, oldSlug, newSlug })
          const cloned = await cloneS3Object({ s3, sourceKey, destKey })
          nextMainImage = { ...(nextMainImage || {}), key: cloned.key, url: cloned.url }
        }
      } catch (error) {
        // Safety: if we fail to clone, drop the key so future edits won't delete the original.
        if (typeof nextMainImage === 'object' && nextMainImage) {
          const { key: _k, ...rest } = nextMainImage
          nextMainImage = rest
        }
        logger.warn('plan-duplicate: failed to clone mainImage', { error, planId: id })
      }

      // Clone itinerary day images (if present)
      for (let i = 0; i < nextItinerary.length; i += 1) {
        const current = nextItinerary[i]
        const url = typeof current?.image === 'string' ? current.image : ''
        if (!url) continue

        if (!isLikelyS3PublicUrl(url, s3.bucket)) continue

        const sourceKey = extractKeyFromUrl(url)
        if (!sourceKey) continue

        try {
          const destKey = deriveDestinationKey({ sourceKey, oldSlug, newSlug })
          const cloned = await cloneS3Object({ s3, sourceKey, destKey })
          current.image = cloned.url
        } catch (error) {
          // Safety: clear the URL so the clone doesn't point to the same asset key.
          current.image = ''
          logger.warn('plan-duplicate: failed to clone itinerary image', {
            error,
            planId: id,
            index: i,
          })
        }
      }
    }

    const created = await prisma.plan.create({
      data: {
        mainTitle: `${existing.mainTitle} (Copy)`,
        articleAlias,
        categoryAlias: existing.categoryAlias,
        section: existing.section,
        promotionalText: existing.promotionalText,
        attractionsTitle: existing.attractionsTitle,
        attractionsText: existing.attractionsText,
        transfersTitle: existing.transfersTitle,
        transfersText: existing.transfersText,
        holidayTitle: existing.holidayTitle,
        holidayText: existing.holidayText,
        includes: existing.includes,
        notIncludes: existing.notIncludes,
        // Prisma's JSON input typing disallows `null` in nested JsonValue; cast is safe for persisted values.
        itinerary: nextItinerary as unknown as Prisma.InputJsonValue[],
        priceOptions: priceOptions as unknown as Prisma.InputJsonValue[],
        generalPolicies: existing.generalPolicies,
        transportOptions: transportOptions as unknown as Prisma.InputJsonValue[],
        allowGroundTransport: existing.allowGroundTransport,
        videoUrl: existing.videoUrl,
        mainImage: (nextMainImage ?? undefined) as unknown as Prisma.InputJsonValue,
        published: false,
      },
      select: {
        id: true,
        mainTitle: true,
        articleAlias: true,
        categoryAlias: true,
        section: true,
        published: true,
        createdAt: true,
      },
    })

    revalidatePath('/admin/dashboard/templates/tourism')

    return NextResponse.json({ success: true, plan: created })
  } catch (error) {
    logger.error('Error duplicating plan', { error, planId: id })
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
