import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Diagnosticando contraseñas...');

    // Obtener el usuario problemático
    const problemUser = await prisma.user.findUnique({
      where: {
        email: 'daniel.ca.pe207@gmail.com'
      },
      include: {
        accounts: {
          where: {
            providerId: 'credential'
          }
        }
      }
    });

    if (!problemUser) {
      return NextResponse.json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    const userPassword = problemUser.password;
    const accountPassword = problemUser.accounts[0]?.password;

    const diagnosis = {
      user: {
        id: problemUser.id,
        email: problemUser.email,
        hasPassword: !!userPassword,
        passwordLength: userPassword?.length || 0,
        passwordStartsWith: userPassword?.substring(0, 10) || 'N/A',
        passwordType: detectPasswordType(userPassword)
      },
      account: {
        exists: !!problemUser.accounts[0],
        hasPassword: !!accountPassword,
        passwordLength: accountPassword?.length || 0,
        passwordStartsWith: accountPassword?.substring(0, 10) || 'N/A',
        passwordType: detectPasswordType(accountPassword),
        providerId: problemUser.accounts[0]?.providerId || 'N/A'
      },
      comparison: {
        passwordsMatch: userPassword === accountPassword,
        bothExist: !!userPassword && !!accountPassword
      }
    };

    console.log('📊 Diagnóstico de contraseñas:', JSON.stringify(diagnosis, null, 2));

    return NextResponse.json({
      success: true,
      diagnosis
    });

  } catch (error) {
    console.error('❌ Error en diagnóstico de contraseñas:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

function detectPasswordType(password: string | null | undefined): string {
  if (!password) return 'none';
  
  // bcrypt hash starts with $2a$, $2b$, $2x$, or $2y$
  if (password.startsWith('$2')) return 'bcrypt';
  
  // argon2 hash starts with $argon2
  if (password.startsWith('$argon2')) return 'argon2';
  
  // scrypt hash (Better Auth default) is typically hex
  if (/^[a-f0-9]+$/.test(password)) return 'hex (possibly scrypt)';
  
  // Base64 encoded
  if (/^[A-Za-z0-9+/]+=*$/.test(password)) return 'base64';
  
  return 'unknown format';
}
