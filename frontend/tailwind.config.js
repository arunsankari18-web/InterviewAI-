/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FDF8F6',
          100: '#F2E8E5',
          200: '#EAD3CD',
          300: '#DCAFA5',
          400: '#CE8B7D',
          500: '#C85A32', // Primary Terracotta / Warm Copper
          600: '#B04B26',
          700: '#8E3A1C',
          800: '#6C2B14',
          900: '#4A1C0D',
        },
        studio: {
          bg: '#F8F9FA',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          border: '#E2E8F0',
          muted: '#64748B',
          text: '#0F172A',
          subtext: '#475569',
          accent: '#C85A32',
          highlight: '#FFF7ED',
          dark: '#1E293B',
          darker: '#0F172A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
