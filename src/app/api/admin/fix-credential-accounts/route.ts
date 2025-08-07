import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    console.log('🔍 Verificando usuarios sin cuenta credential...');

    // Buscar usuarios que no tienen cuenta credential
    const usersWithoutCredentialAccount = await prisma.user.findMany({
      where: {
        accounts: {
          none: {
            providerId: 'credential'
          }
        },
        // Solo usuarios que tienen password (fueron creados para email/password)
        password: {
          not: null
        }
      },
      include: {
        accounts: true
      }
    });

    console.log(`📊 Encontrados ${usersWithoutCredentialAccount.length} usuarios sin cuenta credential`);

    if (usersWithoutCredentialAccount.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Todos los usuarios ya tienen sus cuentas credential',
        fixed: 0
      });
    }

    const fixedUsers = [];

    // Crear cuentas credential para cada usuario
    for (const user of usersWithoutCredentialAccount) {
      console.log(`🔧 Creando cuenta credential para: ${user.email}`);
      
      // Usar la contraseña ya hasheada del usuario
      const hashedPassword = user.password;

      await prisma.account.create({
        data: {
          userId: user.id,
          accountId: user.id,
          providerId: 'credential',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      });

      fixedUsers.push({
        id: user.id,
        email: user.email,
        name: user.name
      });

      console.log(`✅ Cuenta credential creada para: ${user.email}`);
    }

    return NextResponse.json({
      success: true,
      message: `Se crearon ${fixedUsers.length} cuentas credential`,
      fixed: fixedUsers.length,
      users: fixedUsers
    });

  } catch (error) {
    console.error('❌ Error al arreglar cuentas credential:', error);
    
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
