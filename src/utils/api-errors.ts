// src/utils/api-errors.ts
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static handle(error: unknown): NextResponse {
    console.error('🔴 [API] Error:', error);

    if (error instanceof ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Error de validación',
        details: error.errors
      }, { 
        status: 400 
      });
    }

    if (error instanceof ApiError) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { 
        status: error.statusCode 
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { 
      status: 500 
    });
  }
}
