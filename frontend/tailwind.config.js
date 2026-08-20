/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0B0F19',
          800: '#111827',
          700: '#1F2937',
          600: '#374151'
        },
        brand: {
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          accent: '#06B6D4',
          gold: '#F59E0B'
        }
      }
    },
  },
  plugins: [],
}
