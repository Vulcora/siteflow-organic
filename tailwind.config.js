/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.tsx",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand colors - extracted from landing page usage
        brand: {
          // Primary - blue tones
          primary: {
            50: '#eff6ff',   // blue-50
            100: '#dbeafe',  // blue-100
            200: '#bfdbfe',  // blue-200
            300: '#93c5fd',  // blue-300
            400: '#60a5fa',  // blue-400
            500: '#3b82f6',  // blue-500
            600: '#2563eb',  // blue-600
            700: '#1d4ed8',  // blue-700
            DEFAULT: '#2563eb',
          },
          // Secondary - teal tones
          secondary: {
            100: '#ccfbf1',  // teal-100
            300: '#5eead4',  // teal-300
            400: '#2dd4bf',  // teal-400
            500: '#14b8a6',  // teal-500
            600: '#0d9488',  // teal-600
            DEFAULT: '#14b8a6',
          },
          // Accent - cyan for gradients
          accent: {
            300: '#67e8f9',  // cyan-300
            400: '#22d3ee',  // cyan-400
            500: '#06b6d4',  // cyan-500
            DEFAULT: '#06b6d4',
          },
          // Surface colors - slate tones
          surface: {
            50: '#f8fafc',   // slate-50
            100: '#f1f5f9',  // slate-100
            200: '#e2e8f0',  // slate-200
            DEFAULT: '#f8fafc',
          },
          // Text colors
          text: {
            primary: '#0f172a',   // slate-900
            secondary: '#475569', // slate-600
            muted: '#64748b',     // slate-500
            light: '#94a3b8',     // slate-400
          },
          // Dark background
          dark: '#0f172a',  // slate-900
        },
      },
      backgroundImage: {
        // Gradients from index.css moved to theme
        'water-gradient': 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        'text-gradient': 'linear-gradient(to right, #0ea5e9, #2563eb)',
        'cta-gradient': 'linear-gradient(to right, #60a5fa, #67e8f9, #5eead4)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-in-from-top': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-from-bottom': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-from-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-in-from-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'zoom-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'zoom-out': {
          from: { opacity: '1', transform: 'scale(1)' },
          to: { opacity: '0', transform: 'scale(0.95)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out',
        'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
        'slide-in-from-left': 'slide-in-from-left 0.3s ease-out',
        'slide-in-from-right': 'slide-in-from-right 0.3s ease-out',
        'zoom-in': 'zoom-in 0.2s ease-out',
        'zoom-out': 'zoom-out 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
