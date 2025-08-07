import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/encryption';

const S3_CONFIG_KEY = 's3-credentials';

async function getS3Config() {
  try {
    // Intentar obtener de la base de datos
    const s3Config = await prisma.novaConfig.findUnique({
      where: { key: S3_CONFIG_KEY },
    });

    if (s3Config && typeof s3Config.value === 'object' && s3Config.value !== null) {
      const config = s3Config.value as any;
      // Desencriptar la clave secreta
      if (config.secretAccessKey) {
        config.secretAccessKey = decrypt(config.secretAccessKey);
      }
      return config;
    }

    // Fallback a variables de entorno
    const envConfig = {
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };

    if (envConfig.bucket && envConfig.accessKeyId && envConfig.secretAccessKey) {
      return envConfig;
    }

    return null;
  } catch (error) {
    console.error('Error getting S3 config:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Obtener configuración de S3
    const s3Config = await getS3Config();
    if (!s3Config) {
      return NextResponse.json(
        { success: false, error: 'S3 no está configurado' },
        { status: 400 }
      );
    }

    // Obtener el archivo del FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Tipo de archivo no permitido. Solo se permiten imágenes.' },
        { status: 400 }
      );
    }

    // Validar tamaño (10MB máximo)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'El archivo es demasiado grande. Máximo 10MB.' },
        { status: 400 }
      );
    }

    // Crear cliente S3
    const s3Client = new S3Client({
      region: s3Config.region,
      credentials: {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey,
      },
    });

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;
    const key = `${folder}/${fileName}`;

    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Subir archivo a S3
    const uploadCommand = new PutObjectCommand({
      Bucket: s3Config.bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      // No usar ACL, depender de la bucket policy para acceso público
    });

    await s3Client.send(uploadCommand);

    // Construir URL del archivo
    const fileUrl = `https://${s3Config.bucket}.s3.${s3Config.region}.amazonaws.com/${key}`;

    console.log('Archivo subido exitosamente:', {
      fileName,
      key,
      url: fileUrl,
      size: file.size,
      type: file.type
    });

    return NextResponse.json({
      success: true,
      url: fileUrl,
      key,
      fileName,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Error uploading file to S3:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor al subir el archivo' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Obtener configuración de S3
    const s3Config = await getS3Config();
    if (!s3Config) {
      return NextResponse.json(
        { success: false, error: 'S3 no está configurado' },
        { status: 400 }
      );
    }

    // Obtener la key del archivo a eliminar
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json(
        { success: false, error: 'No se proporcionó la key del archivo' },
        { status: 400 }
      );
    }

    // Crear cliente S3
    const s3Client = new S3Client({
      region: s3Config.region,
      credentials: {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey,
      },
    });

    // Eliminar archivo de S3
    const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
    const deleteCommand = new DeleteObjectCommand({
      Bucket: s3Config.bucket,
      Key: key,
    });

    await s3Client.send(deleteCommand);

    console.log('Archivo eliminado exitosamente:', key);

    return NextResponse.json({
      success: true,
      message: 'Archivo eliminado correctamente',
      key
    });

  } catch (error) {
    console.error('Error deleting file from S3:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor al eliminar el archivo' },
      { status: 500 }
    );
  }
}