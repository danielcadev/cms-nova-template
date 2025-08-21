import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  error?: string
  errors?: ValidationError[]
  timestamp: string
  requestId?: string
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

/**
 * Respuesta exitosa
 */
export function createSuccessResponse<T>(
  data?: T,
  message?: string,
  status: number = 200,
): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    message: message || 'Operation successful',
    data,
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(response, { status })
}

/**
 * Respuesta exitosa con paginación
 */
export function createPaginatedResponse<T>(
  data: T[],
  pagination: PaginatedResponse<T>['pagination'],
  message?: string,
  status: number = 200,
): NextResponse {
  const response: PaginatedResponse<T> = {
    success: true,
    message: message || 'Data fetched successfully',
    data,
    pagination,
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(response, { status })
}

/**
 * Error response
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  errors?: ValidationError[],
): NextResponse {
  const response: ApiResponse = {
    success: false,
    error: message,
    errors,
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(response, { status })
}

/**
 * Validation error response
 */
export function createValidationErrorResponse(
  message: string = 'Validation error',
  errors: ValidationError[],
): NextResponse {
  return createErrorResponse(message, 400, errors)
}

/**
 * Not found response
 */
export function createNotFoundResponse(message: string = 'Resource not found'): NextResponse {
  return createErrorResponse(message, 404)
}

/**
 * Unauthorized response
 */
export function createUnauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
  return createErrorResponse(message, 401)
}

/**
 * Forbidden response
 */
export function createForbiddenResponse(message: string = 'Forbidden'): NextResponse {
  return createErrorResponse(message, 403)
}

/**
 * Manejo automático de errores
 */
export function handleApiError(error: unknown): NextResponse {
  // Error de validación de Zod
  if (error instanceof ZodError) {
    const validationErrors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
    }))

    return createValidationErrorResponse('The provided data is not valid', validationErrors)
  }

  // Error de API personalizado
  if (error instanceof ApiError) {
    return createErrorResponse(error.message, error.statusCode)
  }

  // Generic error
  return createErrorResponse('An internal server error occurred. Please try again.', 500)
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Backward compatibility object
export const ApiResponseBuilder = {
  success: createSuccessResponse,
  successPaginated: createPaginatedResponse,
  error: createErrorResponse,
  validationError: createValidationErrorResponse,
  notFound: createNotFoundResponse,
  unauthorized: createUnauthorizedResponse,
  forbidden: createForbiddenResponse,
  handleError: handleApiError,
}

/**
 * Utilidad para obtener parámetros de búsqueda con validación
 */
export function getSearchParams(request: Request) {
  const url = new URL(request.url)
  return {
    page: Math.max(1, parseInt(url.searchParams.get('page') || '1', 10)),
    limit: Math.min(1000, Math.max(1, parseInt(url.searchParams.get('limit') || '10', 10))),
    search: url.searchParams.get('search') || undefined,
    category: url.searchParams.get('category') || undefined,
    sortBy: url.searchParams.get('sortBy') || 'createdAt',
    sortOrder: (url.searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc',
  }
}

/**
 * Utilidad para crear respuesta de paginación
 */
export function createPagination(total: number, page: number, limit: number) {
  const totalPages = Math.ceil(total / limit)

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}
