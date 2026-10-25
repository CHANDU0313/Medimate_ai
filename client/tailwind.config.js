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
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488', // primary teal
          700: '#0f766e', // deep teal (matching screenshot buttons)
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        navy: {
          50: '#f8fafc',
          100: '#f1f5f9',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        urgency: {
          emergency: '#dc2626',
          urgent: '#d97706',
          routine: '#059669',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 20px -2px rgba(15, 118, 110, 0.08), 0 2px 6px -1px rgba(15, 118, 110, 0.04)',
      }
    },
  },
  plugins: [],
}
