/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Hind Siliguri"', '"Plus Jakarta Sans"', '"Outfit"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        english: ['"Outfit"', '"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        brand: ['"Outfit"', '"Plus Jakarta Sans"', 'ui-sans-serif', 'sans-serif']
      },
      colors: {
        brand: {
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
          950: '#022c22',
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neo': '4px 4px 0px 0px rgba(15, 23, 42, 1)',
        'neo-rose': '4px 4px 0px 0px rgba(225, 29, 72, 1)',
        'neo-emerald': '4px 4px 0px 0px rgba(5, 150, 105, 1)',
        'glow-emerald': '0 0 25px rgba(16, 185, 129, 0.45)',
        'glow-indigo': '0 0 25px rgba(99, 102, 241, 0.45)',
        'glow-rose': '0 0 25px rgba(244, 63, 94, 0.45)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        shimmer: {
          'from': { backgroundPosition: '200% 0' },
          'to': { backgroundPosition: '-200% 0' }
        }
      }
    },
  },
  plugins: [],
}
