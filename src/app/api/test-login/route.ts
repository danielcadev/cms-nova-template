import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    console.log(`🔐 Probando login para: ${email}`);

    // Intentar login usando Better Auth directamente
    try {
      const result = await auth.api.signInEmail({
        body: { email, password }
      });

      console.log('✅ Login exitoso:', result);

      return NextResponse.json({
        success: true,
        message: 'Login exitoso',
        user: result.user,
        session: result.session
      });

    } catch (authError: any) {
      console.error('❌ Error de autenticación:', authError);
      
      return NextResponse.json({
        success: false,
        error: 'Error de autenticación',
        details: authError.message || 'Error desconocido',
        code: authError.code || 'UNKNOWN_ERROR'
      }, { status: 401 });
    }

  } catch (error) {
    console.error('❌ Error en test-login:', error);
    
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
