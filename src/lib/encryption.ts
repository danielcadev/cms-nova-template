import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
    throw new Error('La variable de entorno ENCRYPTION_KEY debe ser una clave hexadecimal de 64 caracteres.');
}

const key = Buffer.from(ENCRYPTION_KEY, 'hex');

export function encrypt(text: string): string {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    
    // Devolvemos todo junto en formato: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decrypt(encryptedText: string): string {
    try {
        const parts = encryptedText.split(':');
        if (parts.length !== 3) {
            throw new Error('Formato de texto encriptado inválido.');
        }

        const iv = Buffer.from(parts[0], 'hex');
        const authTag = Buffer.from(parts[1], 'hex');
        const encrypted = Buffer.from(parts[2], 'hex');

        const decipher = createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

        return decrypted.toString('utf8');
    } catch (error) {
        console.error('Error al desencriptar:', error);
        // Devolvemos un string vacío o manejamos el error como prefieras.
        // Nunca devuelvas el texto encriptado.
        return '';
    }
} 
