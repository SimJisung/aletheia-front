import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary - Crystal Blue (Truth, Clarity)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Secondary - Ethereal Violet (Insight, Intuition)
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        // Accent - Truth Gold (Discovery, Revelation)
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Success - Growth, Positive
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Warning
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Error
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Neutral - Slate
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['var(--font-pretendard)', 'system-ui', 'sans-serif'],
        display: ['var(--font-geist)', 'var(--font-pretendard)', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        // Fluid type scale
        'fluid-xs': ['clamp(0.75rem, 0.7rem + 0.1vw, 0.8rem)', { lineHeight: '1.4' }],
        'fluid-sm': ['clamp(0.8125rem, 0.775rem + 0.15vw, 0.875rem)', { lineHeight: '1.5' }],
        'fluid-base': ['clamp(0.875rem, 0.825rem + 0.2vw, 1rem)', { lineHeight: '1.6' }],
        'fluid-lg': ['clamp(1rem, 0.925rem + 0.3vw, 1.125rem)', { lineHeight: '1.5' }],
        'fluid-xl': ['clamp(1.125rem, 1rem + 0.5vw, 1.25rem)', { lineHeight: '1.4' }],
        'fluid-2xl': ['clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)', { lineHeight: '1.35' }],
        'fluid-3xl': ['clamp(1.5rem, 1.3rem + 0.8vw, 1.875rem)', { lineHeight: '1.3' }],
        'fluid-4xl': ['clamp(1.875rem, 1.5rem + 1.5vw, 2.5rem)', { lineHeight: '1.2' }],
        'fluid-5xl': ['clamp(2.5rem, 2rem + 2vw, 3.5rem)', { lineHeight: '1.1' }],
      },
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
      },
      boxShadow: {
        // Multi-layer shadows for depth
        'elevation-xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'elevation-sm': '0 1px 2px 0 rgb(0 0 0 / 0.03), 0 1px 3px 0 rgb(0 0 0 / 0.06)',
        'elevation-md': '0 2px 4px -1px rgb(0 0 0 / 0.04), 0 4px 6px -1px rgb(0 0 0 / 0.08)',
        'elevation-lg': '0 4px 6px -2px rgb(0 0 0 / 0.03), 0 10px 15px -3px rgb(0 0 0 / 0.08)',
        'elevation-xl': '0 8px 10px -3px rgb(0 0 0 / 0.04), 0 20px 25px -5px rgb(0 0 0 / 0.08)',
        'elevation-2xl': '0 12px 20px -5px rgb(0 0 0 / 0.05), 0 25px 50px -12px rgb(0 0 0 / 0.15)',
        // Glass shadows
        'glass-sm': '0 2px 8px -2px rgb(0 0 0 / 0.1)',
        'glass-md': '0 4px 16px -4px rgb(0 0 0 / 0.15)',
        'glass-lg': '0 8px 32px -8px rgb(0 0 0 / 0.2)',
        // Glow effects
        'glow-primary': '0 0 20px rgb(59 130 246 / 0.4)',
        'glow-accent': '0 0 20px rgb(251 191 36 / 0.4)',
        'glow-success': '0 0 20px rgb(16 185 129 / 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.2s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.15s ease-in',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgb(59 130 246 / 0.3)' },
          '50%': { boxShadow: '0 0 30px rgb(59 130 246 / 0.5)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;
