import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: ValidationError[];
  timestamp: string;
  requestId?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export class ApiResponseBuilder {
  /**
   * Respuesta exitosa
   */
  static success<T>(
    data?: T,
    message?: string,
    status: number = 200
  ): NextResponse {
    const response: ApiResponse<T> = {
      success: true,
      message: message || 'Operación exitosa',
      data,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status });
  }

  /**
   * Respuesta exitosa con paginación
   */
  static successPaginated<T>(
    data: T[],
    pagination: PaginatedResponse<T>['pagination'],
    message?: string,
    status: number = 200
  ): NextResponse {
    const response: PaginatedResponse<T> = {
      success: true,
      message: message || 'Datos obtenidos exitosamente',
      data,
      pagination,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status });
  }

  /**
   * Respuesta de error
   */
  static error(
    message: string,
    status: number = 500,
    errors?: ValidationError[]
  ): NextResponse {
    const response: ApiResponse = {
      success: false,
      error: message,
      errors,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status });
  }

  /**
   * Respuesta de validación de error
   */
  static validationError(
    message: string = 'Error de validación',
    errors: ValidationError[]
  ): NextResponse {
    return this.error(message, 400, errors);
  }

  /**
   * Respuesta de no encontrado
   */
  static notFound(
    message: string = 'Recurso no encontrado'
  ): NextResponse {
    return this.error(message, 404);
  }

  /**
   * Respuesta de no autorizado
   */
  static unauthorized(
    message: string = 'No autorizado'
  ): NextResponse {
    return this.error(message, 401);
  }

  /**
   * Respuesta de prohibido
   */
  static forbidden(
    message: string = 'Acceso prohibido'
  ): NextResponse {
    return this.error(message, 403);
  }

  /**
   * Manejo automático de errores
   */
  static handleError(error: unknown): NextResponse {
    console.error('🔴 [API] Error:', error);

    // Error de validación de Zod
    if (error instanceof ZodError) {
      const validationErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }));

      return this.validationError(
        'Los datos proporcionados no son válidos',
        validationErrors
      );
    }

    // Error de API personalizado
    if (error instanceof ApiError) {
      return this.error(error.message, error.statusCode);
    }

    // Error genérico
    return this.error(
      'Ocurrió un error interno del servidor. Por favor, intenta nuevamente.',
      500
    );
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Utilidad para obtener parámetros de búsqueda con validación
 */
export function getSearchParams(request: Request) {
  const url = new URL(request.url);
  return {
    page: Math.max(1, parseInt(url.searchParams.get('page') || '1')),
    limit: Math.min(1000, Math.max(1, parseInt(url.searchParams.get('limit') || '10'))),
    search: url.searchParams.get('search') || undefined,
    category: url.searchParams.get('category') || undefined,
    sortBy: url.searchParams.get('sortBy') || 'createdAt',
    sortOrder: (url.searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc',
  };
}

/**
 * Utilidad para crear respuesta de paginación
 */
export function createPagination(
  total: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(total / limit);
  
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
} 
