/**
 * NOVA CMS - CONFIGURACIÓN DE TEXTOS Y CONCEPTOS
 * ==============================================
 * 
 * Centraliza todos los textos y conceptos del sistema para mantener
 * consistencia en la terminología de las dos arquitecturas.
 */

export const CMS_CONCEPTS = {
  // Template System - Formularios Predefinidos
  TEMPLATES: {
    name: 'Plantillas Predefinidas',
    description: 'Formularios especializados con estructura fija',
    explanation: 'Usa formularios diseñados específicamente para ciertos tipos de contenido',
    examples: ['Planes Turísticos', 'Productos', 'Servicios'],
    benefits: ['Estructura optimizada', 'Validaciones específicas', 'UX especializada'],
    when_to_use: 'Para contenido con estructura compleja y lógica de negocio específica'
  },

  // Headless CMS - Sistema Flexible
  HEADLESS: {
    name: 'CMS Flexible',
    description: 'Contenido personalizable creado por ti',
    explanation: 'Crea tipos de contenido personalizados definiendo tus propios campos',
    examples: ['Blogs', 'Artículos', 'Noticias', 'Portfolio'],
    benefits: ['Máxima flexibilidad', 'Estructura personalizable', 'Fácil de configurar'],
    when_to_use: 'Para contenido dinámico que varía en estructura y necesidades'
  }
};

export const UI_TEXTS = {
  // Navegación
  NAV: {
    dashboard: 'Dashboard',
    templates: 'Plantillas Predefinidas',
    headless: 'CMS Flexible',
    content_created: 'Contenido Creado',
    users: 'Usuarios',
    plugins: 'Plugins',
    settings: 'Configuración'
  },

  // Páginas principales
  PAGES: {
    content_types: {
      title: 'CMS Flexible',
      subtitle: 'Crea tipos de contenido personalizados para tu sitio web',
      empty_state: {
        title: 'No tienes tipos de contenido flexibles',
        description: 'El CMS flexible te permite crear estructuras de contenido personalizadas. Define campos, tipos de datos y crea contenido dinámico.',
        cta: 'Crear Primer Tipo'
      }
    },
    
    view_content: {
      title: 'Contenido Creado',
      subtitle: 'Ve y gestiona todo el contenido de tu sitio web',
      sections: {
        headless: {
          title: 'CMS Flexible',
          description: 'Contenido creado con tipos personalizados'
        },
        templates: {
          title: 'Plantillas Predefinidas', 
          description: 'Contenido creado con formularios especializados'
        }
      }
    },

    content_type_editor: {
      create: {
        title: 'Nuevo Tipo de Contenido',
        subtitle: 'Diseña la estructura de tu contenido flexible'
      },
      edit: {
        title: 'Editar Tipo de Contenido',
        subtitle: 'Modifica la estructura de tu contenido personalizado'
      },
      basic_info: {
        title: 'Información Básica',
        subtitle: 'Define el nombre y propósito de tu tipo de contenido personalizado'
      }
    }
  },

  // Ayudas y consejos
  TIPS: {
    architecture_comparison: {
      title: '🎯 CMS Flexible vs Plantillas Predefinidas',
      content: {
        flexible: 'Crea tipos de contenido personalizados (blogs, artículos, productos, etc.)',
        templates: 'Usa formularios especializados como Planes Turísticos con estructura fija.'
      }
    }
  }
};

export const FIELD_HELP_TEXTS = {
  TEXT: {
    label: 'Texto',
    description: 'Campo de texto corto para títulos, nombres y frases',
    example: 'Ej: Título del artículo, Nombre del producto',
    maxLength: 'Hasta 255 caracteres'
  },
  
  RICH_TEXT: {
    label: 'Texto Rico',
    description: 'Texto largo con formato (negritas, cursivas, listas, enlaces)',
    example: 'Ej: Contenido de blog, descripciones detalladas, artículos',
    maxLength: 'Sin límite de caracteres'
  },
  
  NUMBER: {
    label: 'Número',
    description: 'Valores numéricos para precios, cantidades, edades',
    example: 'Ej: Precio: 99.99, Edad: 25, Cantidad: 10',
    maxLength: 'Números enteros o decimales'
  },
  
  BOOLEAN: {
    label: 'Verdadero/Falso',
    description: 'Campo de selección para opciones de sí/no',
    example: 'Ej: Producto destacado, Publicado, Activo',
    maxLength: 'Valor booleano'
  },
  
  DATE: {
    label: 'Fecha',
    description: 'Selector de fecha y hora',
    example: 'Ej: Fecha de publicación, Fecha de evento',
    maxLength: 'Formato de fecha'
  },
  
  MEDIA: {
    label: 'Imágenes/Videos',
    description: 'Sube y gestiona imágenes, videos o archivos',
    example: 'Ej: Foto de portada, galería de imágenes, video promocional',
    maxLength: 'Máximo 10MB por archivo'
  }
};
