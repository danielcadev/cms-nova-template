import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encrypt, decrypt } from '@/lib/encryption';

// Usaremos una clave fija para la configuración de S3
const S3_CONFIG_KEY = 's3-credentials';

export async function GET() {
    try {
        console.log('=== DEBUG S3 CONFIG ===');
        
        // Primero intentar obtener de la base de datos
        const s3Config = await prisma.novaConfig.findUnique({
            where: { key: S3_CONFIG_KEY },
        });

        console.log('Configuración en BD:', s3Config);

        if (s3Config && typeof s3Config.value === 'object' && s3Config.value !== null) {
            const config = s3Config.value as any;
            console.log('Configuración encontrada en BD:', {
                bucket: config.bucket,
                region: config.region,
                hasAccessKey: !!config.accessKeyId,
                hasSecretKey: !!config.secretAccessKey
            });
            
            // Desencriptamos la clave secreta antes de enviarla al cliente
            if (config.secretAccessKey) {
                config.secretAccessKey = decrypt(config.secretAccessKey);
            }
            return NextResponse.json({ success: true, config, source: 'database' });
        } 
        
        // Si no hay configuración en BD, intentar leer desde variables de entorno
        const envConfig = {
            bucket: process.env.AWS_S3_BUCKET,
            region: process.env.AWS_REGION || 'us-east-1',
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        };

        console.log('Variables de entorno:', {
            bucket: envConfig.bucket,
            region: envConfig.region,
            hasAccessKey: !!envConfig.accessKeyId,
            hasSecretKey: !!envConfig.secretAccessKey
        });

        // Verificar que todas las variables de entorno estén presentes
        if (envConfig.bucket && envConfig.accessKeyId && envConfig.secretAccessKey) {
            console.log('S3 configurado desde variables de entorno');
            return NextResponse.json({ 
                success: true, 
                config: envConfig,
                source: 'env'
            });
        }
        
        console.log('No se encontró configuración S3 ni en BD ni en .env');
        // Si no hay configuración ni en BD ni en .env
        return NextResponse.json({ success: true, config: null });

    } catch (error) {
        console.error('Error al obtener la configuración de S3:', error);
        return new NextResponse(
            JSON.stringify({ success: false, error: 'Error interno del servidor' }),
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Encriptamos la clave secreta antes de guardarla
        if (body.secretAccessKey) {
            body.secretAccessKey = encrypt(body.secretAccessKey);
        }

        const s3Config = await prisma.novaConfig.upsert({
            where: { key: S3_CONFIG_KEY },
            update: { value: body },
            create: {
                key: S3_CONFIG_KEY,
                value: body,
                category: 'plugin',
            },
        });

        // No devolvemos la clave encriptada al cliente por seguridad
        const responseData = { ...s3Config, value: { ...body, secretAccessKey: '••••••••' } };
        return NextResponse.json({ success: true, config: responseData });

    } catch (error) {
        console.error('Error al guardar la configuración de S3:', error);
        return new NextResponse(
            JSON.stringify({ success: false, error: 'Error interno del servidor' }),
            { status: 500 }
        );
    }
} 
