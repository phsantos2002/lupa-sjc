/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FBF8F0',
          100: '#F5EDD6',
          200: '#EBDAAD',
          300: '#DFC47F',
          400: '#D4AF5B',
          500: '#C9A84C',
          600: '#B08E3A',
          700: '#8F7230',
          800: '#6B5524',
          900: '#4A3B19',
        },
        lupa: {
          gold: '#C9A84C',
          'gold-light': '#D4B96A',
          'gold-dark': '#A6832A',
          black: '#1A1A1A',
          dark: '#2D2D2D',
          bg: '#FAFAF8',
          cream: '#F5F1EB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
      },
    },
  },
  plugins: [],
}
