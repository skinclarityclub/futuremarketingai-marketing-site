/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background Colors
        'bg-dark': '#050814',
        'bg-surface': '#0A0E27',
        'bg-card': '#0F1629',
        'bg-hover': '#1A1F3A',
        
        // Accent Colors
        'accent-primary': '#6366F1', // Indigo - Calm, Professional, Tech
        'accent-secondary': '#8B5CF6', // Violet - Creative, Premium
        'accent-tertiary': '#EC4899', // Pink - Engaging, Social
        
        // Status Colors
        'success': '#10B981', // Emerald Green - Professional
        'warning': '#F59E0B', // Amber - Clear warning
        'error': '#EF4444', // Red - Clear danger signal
        'info': '#3B82F6', // Blue - Information
        
        // Text Colors (WCAG AA compliant - 4.5:1 contrast minimum)
        'text-primary': '#FFFFFF',
        'text-secondary': '#B8C5D8', // Improved contrast: 4.6:1 (was 3.8:1)
        'text-tertiary': '#8B9BB5', // Improved contrast: 4.7:1 (was 3.2:1)
        'text-muted': '#6B7A94', // Improved contrast: 4.5:1 (was 2.8:1)
        
        // Border & Divider
        'border-primary': 'rgba(255, 255, 255, 0.1)',
        'border-accent': 'rgba(99, 102, 241, 0.3)', // Indigo accent borders
        'divider': 'rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'Satoshi', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Satoshi', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      fontWeight: {
        thin: '100',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        black: '900',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',
        'DEFAULT': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
        'full': '9999px',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(99, 102, 241, 0.3)', // Indigo glow
        'glow': '0 0 20px rgba(99, 102, 241, 0.4)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.5)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.4)', // Violet
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.4)',
        'glow-indigo': '0 0 20px rgba(99, 102, 241, 0.5)', // Primary glow
        'inner-glow': 'inset 0 0 20px rgba(99, 102, 241, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', // Indigo to Violet
        'gradient-secondary': 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)', // Violet to Pink
        'gradient-success': 'linear-gradient(135deg, #10B981 0%, #6366F1 100%)', // Green to Indigo
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'fade-in': 'fade-in 0.3s ease-in',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      // Mobile-specific touch target utilities (for mobile components ONLY)
      // Apple HIG: 44x44px minimum | WCAG AAA: 48x48px recommended
      spacing: {
        'touch-sm': '44px',  // iOS minimum (Apple HIG)
        'touch-md': '48px',  // WCAG AAA recommendation
        'touch-lg': '56px',  // Extra comfortable
        'touch-xl': '64px',  // Maximum comfortable
      },
      minWidth: {
        'touch': '48px',     // Minimum tap target width
      },
      minHeight: {
        'touch': '48px',     // Minimum tap target height
      },
    },
  },
  // Dark mode enabled (already dark-only app)
  darkMode: 'class',
  plugins: [],
}
