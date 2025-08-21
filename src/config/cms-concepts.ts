/**
 * NOVA CMS - TEXT AND CONCEPTS CONFIGURATION
 * ==========================================
 *
 * Centralizes all system texts and concepts to maintain
 * consistency in terminology across both architectures.
 */

export const CMS_CONCEPTS = {
  // Template System - Predefined Forms
  TEMPLATES: {
    name: 'Predefined Templates',
    description: 'Specialized forms with fixed structure',
    explanation: 'Use forms designed specifically for certain types of content',
    examples: ['Travel Plans', 'Products', 'Services'],
    benefits: ['Optimized structure', 'Specific validations', 'Specialized UX'],
    when_to_use: 'For content with complex structure and specific business logic',
  },

  // Headless CMS - Flexible System
  HEADLESS: {
    name: 'Flexible CMS',
    description: 'Customizable content created by you',
    explanation: 'Create custom content types by defining your own fields',
    examples: ['Blogs', 'Articles', 'News', 'Portfolio'],
    benefits: ['Maximum flexibility', 'Customizable structure', 'Easy to configure'],
    when_to_use: 'For dynamic content that varies in structure and needs',
  },
}

export const UI_TEXTS = {
  // Navigation
  NAV: {
    dashboard: 'Dashboard',
    templates: 'Predefined Templates',
    headless: 'Flexible CMS',
    content_created: 'Created Content',
    users: 'Users',
    plugins: 'Plugins',
    settings: 'Settings',
  },

  // Main Pages
  PAGES: {
    content_types: {
      title: 'Flexible CMS',
      subtitle: 'Create custom content types for your website',
      empty_state: {
        title: 'You have no flexible content types',
        description:
          'The flexible CMS allows you to create custom content structures. Define fields, data types and create dynamic content.',
        cta: 'Create First Type',
      },
    },

    view_content: {
      title: 'Created Content',
      subtitle: 'View and manage all your website content',
      sections: {
        headless: {
          title: 'Flexible CMS',
          description: 'Content created with custom types',
        },
        templates: {
          title: 'Predefined Templates',
          description: 'Content created with specialized forms',
        },
      },
    },

    content_type_editor: {
      create: {
        title: 'New Content Type',
        subtitle: 'Design the structure of your flexible content',
      },
      edit: {
        title: 'Edit Content Type',
        subtitle: 'Modify the structure of your custom content',
      },
      basic_info: {
        title: 'Basic Information',
        subtitle: 'Define the name and purpose of your custom content type',
      },
    },
  },

  // Help and tips
  TIPS: {
    architecture_comparison: {
      title: '🎯 Flexible CMS vs Predefined Templates',
      content: {
        flexible: 'Create custom content types (blogs, articles, products, etc.)',
        templates: 'Use specialized forms like Travel Plans with fixed structure.',
      },
    },
  },
}

export const FIELD_HELP_TEXTS = {
  TEXT: {
    label: 'Text',
    description: 'Short text field for titles, names and phrases',
    example: 'Ex: Article title, Product name',
    maxLength: 'Up to 255 characters',
  },

  RICH_TEXT: {
    label: 'Rich Text',
    description: 'Long text with formatting (bold, italic, lists, links)',
    example: 'Ex: Blog content, detailed descriptions, articles',
    maxLength: 'No character limit',
  },

  NUMBER: {
    label: 'Number',
    description: 'Numeric values for prices, quantities, ages',
    example: 'Ex: Price: 99.99, Age: 25, Quantity: 10',
    maxLength: 'Integer or decimal numbers',
  },

  BOOLEAN: {
    label: 'True/False',
    description: 'Selection field for yes/no options',
    example: 'Ex: Featured product, Published, Active',
    maxLength: 'Boolean value',
  },

  DATE: {
    label: 'Date',
    description: 'Date and time picker',
    example: 'Ex: Publication date, Event date',
    maxLength: 'Date format',
  },

  MEDIA: {
    label: 'Images/Videos',
    description: 'Upload and manage images, videos or files',
    example: 'Ex: Cover photo, image gallery, promotional video',
    maxLength: 'Maximum 10MB per file',
  },
}
