import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { decrypt } from '@/lib/encryption'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { getAdminSession } from '@/lib/server-session'
import { ApiResponseBuilder as R } from '@/utils/api-response'
import logger from '@/utils/logger'

const S3_CONFIG_KEY = 's3-credentials'
const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15MB
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

const deleteSchema = z.object({
  key: z.string().min(1, 'Key requerida'),
})

async function getS3Config() {
  try {
    const s3Config = await prisma.novaConfig.findUnique({ where: { key: S3_CONFIG_KEY } })

    if (s3Config && typeof s3Config.value === 'object' && s3Config.value !== null) {
      const config = s3Config.value as any
      if (config.secretAccessKey) {
        config.secretAccessKey = decrypt(config.secretAccessKey)
      }
      return config
    }

    const envConfig = {
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }

    if (envConfig.bucket && envConfig.accessKeyId && envConfig.secretAccessKey) {
      return envConfig
    }

    return null
  } catch (error) {
    logger.error('Error getting S3 config:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return R.error('Unauthorized', 401)

    const rl = rateLimit(request as unknown as Request, {
      limit: 10,
      windowMs: 60_000,
      key: 'upload:POST',
    })
    if (!rl.allowed) {
      return R.error('Too many requests. Please try again later.', 429)
    }

    const s3Config = await getS3Config()
    if (!s3Config) {
      return R.error('S3 is not configured', 400)
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folderRaw = (formData.get('folder') as string | null) ?? 'uploads'
    const folder = String(folderRaw).replace(/^\/+/, '')

    if (!file) return R.error('No file provided', 400)

    if (!allowedTypes.includes(file.type)) {
      return R.error('Unsupported file type. Only images are allowed.', 400)
    }

    if (file.size > MAX_FILE_SIZE) {
      // 413 Payload Too Large
      return NextResponse.json(
        { success: false, error: 'File too large. Max 10MB.' },
        { status: 413 },
      )
    }

    const s3Client = new S3Client({
      region: s3Config.region,
      credentials: {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey,
      },
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    })

    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.includes('.') ? file.name.split('.').pop() : 'bin'
    const fileName = `${timestamp}-${randomString}.${fileExtension}`
    const key = `${folder}/${fileName}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    await s3Client.send(
      new PutObjectCommand({
        Bucket: s3Config.bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }),
    )

    const fileUrl = `https://${s3Config.bucket}.s3.${s3Config.region}.amazonaws.com/${key}`

    try {
      await prisma.asset.create({
        data: { key, url: fileUrl, mimeType: file.type, size: file.size, folder },
      })
    } catch (_e) {
      // Swallow metadata persistence errors; the file is already uploaded.
    }

    return R.success(
      { url: fileUrl, key, fileName, size: file.size, type: file.type },
      'File uploaded',
    )
  } catch (error) {
    logger.error('Error uploading file to S3:', error)
    return R.error('Internal server error while uploading file', 500)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return R.error('Unauthorized', 401)

    const rl = rateLimit(request as unknown as Request, {
      limit: 20,
      windowMs: 60_000,
      key: 'upload:DELETE',
    })
    if (!rl.allowed) {
      return R.error('Too many requests. Please try again later.', 429)
    }

    const s3Config = await getS3Config()
    if (!s3Config) return R.error('S3 is not configured', 400)

    const json = await request.json().catch(() => ({}))
    const parsed = deleteSchema.safeParse(json)
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

    const s3Client = new S3Client({
      region: s3Config.region,
      credentials: { accessKeyId: s3Config.accessKeyId, secretAccessKey: s3Config.secretAccessKey },
    })

    await s3Client.send(new DeleteObjectCommand({ Bucket: s3Config.bucket, Key: parsed.data.key }))

    try {
      await prisma.asset.delete({ where: { key: parsed.data.key } })
    } catch { }

    return R.success({ key: parsed.data.key }, 'File deleted')
  } catch (error) {
    logger.error('Error deleting file from S3:', error)
    return R.error('Internal server error while deleting file', 500)
  }
}
