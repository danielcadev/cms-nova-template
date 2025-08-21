import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/server-session'

const FOLDERS_CONFIG_KEY = 'media-folders'

async function getConfiguredFolders(): Promise<string[]> {
  const cfg = await prisma.novaConfig.findUnique({ where: { key: FOLDERS_CONFIG_KEY } })
  const value = (cfg?.value ?? []) as any
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'string')
  return []
}

async function setConfiguredFolders(folders: string[]) {
  await prisma.novaConfig.upsert({
    where: { key: FOLDERS_CONFIG_KEY },
    update: { value: folders },
    create: { key: FOLDERS_CONFIG_KEY, value: folders, category: 'media' },
  })
}

export async function GET(_req: NextRequest) {
  try {
    const dbFolders = await prisma.asset.findMany({
      distinct: ['folder'],
      select: { folder: true },
      orderBy: { folder: 'asc' },
    })
    const configured = await getConfiguredFolders()
    const set = new Set<string>(['uploads']) // ensure default folder exists
    configured.forEach((f) => f && set.add(String(f).replace(/^\/+/, '')))
    dbFolders.forEach((r) => r.folder && set.add(String(r.folder).replace(/^\/+/, '')))

    return NextResponse.json({ success: true, folders: Array.from(set).sort() })
  } catch (e) {
    console.error('Error fetching folders', e)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session)
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const raw = String(body?.name || '').trim()
    if (!raw)
      return NextResponse.json({ success: false, error: 'Folder name required' }, { status: 400 })
    // basic validation
    if (!/^[a-zA-Z0-9-_/]+$/.test(raw)) {
      return NextResponse.json({ success: false, error: 'Invalid folder name' }, { status: 400 })
    }
    const name = raw.replace(/^\/+/, '')

    // Persist in configured folders list
    const existing = await getConfiguredFolders()
    if (!existing.includes(name)) {
      existing.push(name)
      await setConfiguredFolders(existing)
    }

    // Try to create folder marker in S3 if configured
    try {
      const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3')
      const { prisma } = await import('@/lib/prisma')

      // Load S3 config from DB or env (same logic used in upload)
      const s3CfgRow = await prisma.novaConfig.findUnique({ where: { key: 's3-credentials' } })
      let s3Config: any = null
      if (s3CfgRow && typeof s3CfgRow.value === 'object' && s3CfgRow.value) {
        const { decrypt } = await import('@/lib/encryption')
        const cfg: any = s3CfgRow.value
        if (cfg.secretAccessKey) cfg.secretAccessKey = decrypt(cfg.secretAccessKey)
        s3Config = cfg
      } else {
        s3Config = {
          bucket: process.env.AWS_S3_BUCKET,
          region: process.env.AWS_REGION || 'us-east-1',
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
        if (!s3Config.bucket || !s3Config.accessKeyId || !s3Config.secretAccessKey) s3Config = null
      }

      if (s3Config) {
        const s3 = new S3Client({
          region: s3Config.region,
          credentials: {
            accessKeyId: s3Config.accessKeyId,
            secretAccessKey: s3Config.secretAccessKey,
          },
        })
        const key = `${name.replace(/\/+$/, '')}/`
        await s3.send(
          new PutObjectCommand({ Bucket: s3Config.bucket, Key: key, Body: new Uint8Array() }),
        )
      }
    } catch (err) {
      // Do not fail folder creation if S3 marker fails; log only
      console.warn('S3 folder marker creation failed:', err)
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Error creating folder', e)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session)
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const raw = String(body?.name || '').trim()
    if (!raw)
      return NextResponse.json({ success: false, error: 'Folder name required' }, { status: 400 })
    const name = raw.replace(/^\/+/, '').replace(/\/+$/, '')
    if (!name)
      return NextResponse.json({ success: false, error: 'Folder name required' }, { status: 400 })
    if (name === 'uploads')
      return NextResponse.json(
        { success: false, error: 'Cannot delete root uploads folder' },
        { status: 400 },
      )

    // Delete from S3 (all objects under prefix)
    try {
      const { S3Client, ListObjectsV2Command, DeleteObjectsCommand } = await import(
        '@aws-sdk/client-s3'
      )
      const { prisma } = await import('@/lib/prisma')

      // Load S3 config from DB or env
      const s3CfgRow = await prisma.novaConfig.findUnique({ where: { key: 's3-credentials' } })
      let s3Config: any = null
      if (s3CfgRow && typeof s3CfgRow.value === 'object' && s3CfgRow.value) {
        const { decrypt } = await import('@/lib/encryption')
        const cfg: any = s3CfgRow.value
        if (cfg.secretAccessKey) cfg.secretAccessKey = decrypt(cfg.secretAccessKey)
        s3Config = cfg
      } else {
        s3Config = {
          bucket: process.env.AWS_S3_BUCKET,
          region: process.env.AWS_REGION || 'us-east-1',
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
        if (!s3Config.bucket || !s3Config.accessKeyId || !s3Config.secretAccessKey) s3Config = null
      }

      if (s3Config) {
        const s3 = new S3Client({
          region: s3Config.region,
          credentials: {
            accessKeyId: s3Config.accessKeyId,
            secretAccessKey: s3Config.secretAccessKey,
          },
        })
        const prefix = `${name}/`

        // Paginate and delete in batches (max 1000 per request)
        let ContinuationToken: string | undefined
        do {
          const listed = await s3.send(
            new ListObjectsV2Command({
              Bucket: s3Config.bucket,
              Prefix: prefix,
              ContinuationToken,
            }),
          )
          const objects = (listed.Contents || []).map((o) => ({ Key: o.Key! }))
          if (objects.length) {
            await s3.send(
              new DeleteObjectsCommand({ Bucket: s3Config.bucket, Delete: { Objects: objects } }),
            )
          }
          ContinuationToken = listed.IsTruncated ? listed.NextContinuationToken : undefined
        } while (ContinuationToken)
      }
    } catch (err) {
      console.warn('S3 folder deletion failed:', err)
    }

    // Delete DB assets under folder
    await prisma.asset.deleteMany({ where: { folder: name } })

    // Remove from configured folders list
    const existing = await getConfiguredFolders()
    const updated = existing.filter((f) => f !== name)
    await setConfiguredFolders(updated)

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Error deleting folder', e)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
