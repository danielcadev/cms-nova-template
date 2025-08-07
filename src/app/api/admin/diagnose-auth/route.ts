import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Diagnosticando estado de autenticación...');

    // Contar usuarios totales
    const totalUsers = await prisma.user.count();
    
    // Contar cuentas totales
    const totalAccounts = await prisma.account.count();
    
    // Contar cuentas credential
    const credentialAccounts = await prisma.account.count({
      where: {
        providerId: 'credential'
      }
    });

    // Obtener todos los usuarios con sus cuentas
    const usersWithAccounts = await prisma.user.findMany({
      include: {
        accounts: {
          select: {
            id: true,
            providerId: true,
            accountId: true,
            password: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Buscar usuarios sin cuenta credential
    const usersWithoutCredentialAccount = await prisma.user.findMany({
      where: {
        accounts: {
          none: {
            providerId: 'credential'
          }
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        createdAt: true
      }
    });

    // Buscar el usuario específico del error
    const problemUser = await prisma.user.findUnique({
      where: {
        email: 'daniel.ca.pe207@gmail.com'
      },
      include: {
        accounts: true
      }
    });

    const diagnosis = {
      summary: {
        totalUsers,
        totalAccounts,
        credentialAccounts,
        usersWithoutCredentialAccount: usersWithoutCredentialAccount.length
      },
      problemUser: problemUser ? {
        id: problemUser.id,
        email: problemUser.email,
        name: problemUser.name,
        hasPassword: !!problemUser.password,
        emailVerified: problemUser.emailVerified,
        accounts: problemUser.accounts.map(acc => ({
          providerId: acc.providerId,
          accountId: acc.accountId,
          hasPassword: !!acc.password
        }))
      } : null,
      usersWithoutCredentialAccount: usersWithoutCredentialAccount.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        hasPassword: !!user.password,
        createdAt: user.createdAt
      })),
      allUsersWithAccounts: usersWithAccounts.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        hasPassword: !!user.password,
        accounts: user.accounts.map(acc => ({
          providerId: acc.providerId,
          accountId: acc.accountId,
          hasPassword: !!acc.password
        }))
      }))
    };

    console.log('📊 Diagnóstico completo:', JSON.stringify(diagnosis, null, 2));

    return NextResponse.json({
      success: true,
      diagnosis
    });

  } catch (error) {
    console.error('❌ Error en diagnóstico:', error);
    
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
