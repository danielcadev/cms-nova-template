/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // iOS 26 Design System
      fontFamily: {
        'sf': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'system-ui', 'sans-serif'],
        'sf-display': ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        'sf-text': ['SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      colors: {
        // iOS System Colors
        ios: {
          primary: '#007AFF',
          secondary: '#5856D6',
          success: '#34C759',
          warning: '#FF9500',
          danger: '#FF3B30',
          indigo: '#5856D6',
          purple: '#AF52DE',
          pink: '#FF2D92',
          red: '#FF3B30',
          orange: '#FF9500',
          yellow: '#FFCC00',
          green: '#34C759',
          mint: '#00C7BE',
          teal: '#30B0C7',
          cyan: '#32D2FF',
          blue: '#007AFF',
          gray: {
            1: '#F2F2F7',
            2: '#E5E5EA', 
            3: '#D1D1D6',
            4: '#C7C7CC',
            5: '#AEAEB2',
            6: '#8E8E93',
          }
        },
        // Surface colors
        surface: {
          primary: 'rgba(255, 255, 255, 0.92)',
          secondary: 'rgba(242, 242, 247, 0.8)',
          tertiary: 'rgba(255, 255, 255, 0.7)',
        }
      },
      borderRadius: {
        'ios': '12px',
        'ios-lg': '16px', 
        'ios-xl': '20px',
        'ios-2xl': '24px',
        'ios-3xl': '28px',
      },
      boxShadow: {
        'ios': '0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 16px rgba(0, 0, 0, 0.08)',
        'ios-lg': '0 2px 8px rgba(0, 0, 0, 0.04), 0 8px 32px rgba(0, 0, 0, 0.06)',
        'ios-xl': '0 4px 16px rgba(0, 0, 0, 0.08), 0 12px 48px rgba(0, 0, 0, 0.12)',
        'ios-button': '0 2px 8px rgba(0, 122, 255, 0.25), 0 8px 32px rgba(0, 122, 255, 0.15)',
      },
      animation: {
        'ios-bounce': 'ios-bounce 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'ios-slide-up': 'ios-slide-up 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'ios-fade-in': 'ios-fade-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'ios-scale-in': 'ios-scale-in 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      keyframes: {
        'ios-bounce': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '60%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'ios-slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'ios-fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'ios-scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      spacing: {
        'ios': '16px',
        'ios-lg': '24px', 
        'ios-xl': '32px',
        'ios-2xl': '40px',
        'ios-3xl': '48px',
      },
      fontSize: {
        'ios-title-1': ['34px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'ios-title-2': ['28px', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '700' }],
        'ios-title-3': ['22px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'ios-headline': ['17px', { lineHeight: '1.35', letterSpacing: '-0.005em', fontWeight: '600' }],
        'ios-body': ['17px', { lineHeight: '1.4', fontWeight: '400' }],
        'ios-callout': ['16px', { lineHeight: '1.35', fontWeight: '400' }],
        'ios-subhead': ['15px', { lineHeight: '1.35', fontWeight: '400' }],
        'ios-footnote': ['13px', { lineHeight: '1.35', fontWeight: '400' }],
        'ios-caption': ['12px', { lineHeight: '1.35', fontWeight: '400' }],
      }
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function({ addComponents }) {
      addComponents({
        '.ios-menu-item': {
          'border-radius': '12px',
          'transition': 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '&:hover': {
            'border-radius': '12px !important',
            'background': 'var(--ios-surface-secondary)',
            'transform': 'scale(1.02) translateY(-1px)',
          },
          '&:focus': {
            'border-radius': '12px !important',
          },
          '&:active': {
            'border-radius': '12px !important',
            'transform': 'scale(0.98)',
          }
        },
        '.ios-section-header': {
          'border-radius': '20px',
          'transition': 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '&:hover': {
            'border-radius': '20px !important',
            'background': 'var(--ios-surface-secondary)',
            'transform': 'scale(1.01) translateY(-1px)',
          },
          '&:focus': {
            'border-radius': '20px !important',
          },
          '&:active': {
            'border-radius': '20px !important',
            'transform': 'scale(0.99)',
          }
        }
      })
    }
  ],
}; 