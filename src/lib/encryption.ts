import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const _AUTH_TAG_LENGTH = 16

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ''
const IS_HEX_64 = /^[0-9a-fA-F]{64}$/

function getKeyOrThrow() {
  if (!IS_HEX_64.test(ENCRYPTION_KEY)) {
    const err = new Error(
      'ENCRYPTION_KEY requerido. Configura una clave hexadecimal de 64 caracteres para cifrar secretos.',
    ) as Error & { code?: string }
    err.code = 'ENCRYPTION_NOT_CONFIGURED'
    throw err
  }
  return Buffer.from(ENCRYPTION_KEY, 'hex')
}

export function encrypt(text: string): string {
  const key = getKeyOrThrow()
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  // Devolvemos todo junto en formato: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`
}

export function decrypt(encryptedText: string): string {
  try {
    const parts = encryptedText.split(':')
    if (parts.length !== 3) {
      throw new Error('Formato de texto encriptado inválido.')
    }

    const key = getKeyOrThrow()
    const iv = Buffer.from(parts[0], 'hex')
    const authTag = Buffer.from(parts[1], 'hex')
    const encrypted = Buffer.from(parts[2], 'hex')

    const decipher = createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])

    return decrypted.toString('utf8')
  } catch (_error) {
    return ''
  }
}
