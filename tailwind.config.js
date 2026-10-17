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
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#c7d9fe',
          300: '#9fbeff',
          400: '#7097fe',
          500: '#466ff8',
          600: '#284bee',
          700: '#1e38da',
          800: '#1e2fae',
          900: '#1e2d8a',
          950: '#141c54',
        },
        navy: {
          800: '#0f172a',
          900: '#0b1120',
          950: '#070b14',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
