// Tipos genéricos para reemplazar tipos específicos de Prisma
// Esto nos ayuda a evitar problemas de compatibilidad entre versiones

export type JsonObject = Record<string, unknown>;
export type JsonArray = unknown[];
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;

// Tipo genérico para argumentos de búsqueda de planes
export interface PlanFindManyArgs {
  where?: {
    published?: boolean;
    categoryAlias?: string;
    mainTitle?: {
      contains?: string;
      mode?: 'insensitive';
    };
  };
  orderBy?: {
    createdAt?: 'asc' | 'desc';
    updatedAt?: 'asc' | 'desc';
    mainTitle?: 'asc' | 'desc';
  }[];
  take?: number;
  skip?: number;
  include?: {
    [key: string]: boolean;
  };
}

// Tipo para opciones de precio
export interface PriceOption {
  id: string;
  name: string;
  price: number;
  currency: string;
  description?: string;
  features?: string[];
}

// Tipo para transformadores de datos
export interface DataTransformer<T, R> {
  transform: (input: T) => R;
  validate?: (input: T) => boolean;
} 
