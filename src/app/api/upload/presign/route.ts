import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { decrypt } from '@/lib/encryption'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { getAdminSession } from '@/lib/server-session'
import { ApiResponseBuilder as R } from '@/utils/api-response'

const S3_CONFIG_KEY = 's3-credentials'
const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15MB
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

const presignSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  folder: z.string().optional().default('uploads'),
  size: z.number().int().positive(),
})

async function getS3Config() {
  const s3Config = await prisma.novaConfig.findUnique({ where: { key: S3_CONFIG_KEY } })
  if (s3Config && typeof s3Config.value === 'object' && s3Config.value !== null) {
    const cfg = s3Config.value as any
    return {
      bucket: cfg.bucket,
      region: cfg.region || 'us-east-1',
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey ? decrypt(cfg.secretAccessKey) : undefined,
    }
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

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return R.error('Unauthorized', 401)

    const rl = rateLimit(request as unknown as Request, {
      limit: 30,
      windowMs: 60_000,
      key: 'upload:presign:POST',
    })
    if (!rl.allowed) return R.error('Too many requests. Please try again later.', 429)

    const json = await request.json().catch(() => ({}))
    const parsed = presignSchema.safeParse(json)
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

    const { fileName, contentType, folder, size } = parsed.data

    if (!allowedTypes.includes(contentType))
      return R.error('Unsupported file type. Only images are allowed.', 400)
    if (size > MAX_FILE_SIZE)
      return NextResponse.json(
        { success: false, error: 'File too large. Max 10MB.' },
        { status: 413 },
      )

    const s3 = await getS3Config()
    if (!s3) return R.error('S3 is not configured', 400)

    const safeFolder = String(folder || 'uploads').replace(/^\/+/, '')
    const timestamp = Date.now()
    const rand = Math.random().toString(36).slice(2)
    const ext = fileName.includes('.') ? fileName.split('.').pop() : 'bin'
    const objectFileName = `${timestamp}-${rand}.${ext}`
    const key = `${safeFolder}/${objectFileName}`

    const s3Client = new S3Client({
      region: s3.region,
      credentials: {
        accessKeyId: s3.accessKeyId!,
        secretAccessKey: s3.secretAccessKey!,
      },
    })

    const command = new PutObjectCommand({
      Bucket: s3.bucket,
      Key: key,
      ContentType: contentType,
    })

    // Default 60s expiration is fine; you can tweak with third param { expiresIn }
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 })

    const bucketDomain = `${s3.bucket}.s3.${s3.region}.amazonaws.com`
    const publicUrl = `https://${bucketDomain}/${key}`

    return R.success(
      {
        url,
        key,
        fileName: objectFileName,
        fields: null, // Using v3 presigned URL for PUT; no form fields needed
        headers: { 'Content-Type': contentType },
        maxSize: MAX_FILE_SIZE,
        allowedTypes,
        bucket: s3.bucket,
        region: s3.region,
        bucketDomain,
        publicUrl,
      },
      'Presigned URL generated',
    )
  } catch (_error) {
    return R.error('Internal server error while generating presigned URL', 500)
  }
}

// Handle preflight requests to avoid 405 on OPTIONS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: 'POST, OPTIONS',
    },
  })
}
