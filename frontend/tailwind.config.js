/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        tauste: {
          blue: '#1B2A6B',
          'blue-dark': '#0F1A4A',
          'blue-light': '#2E3F8E',
          orange: '#F5841F',
          'orange-light': '#FF9B3D',
          'orange-dark': '#D96D0A',
        },
        lupa: {
          gold: '#C9A84C',
          'gold-light': '#D4B96A',
          'gold-dark': '#A6832A',
          black: '#1A1A1A',
          dark: '#2D2D2D',
          bg: '#F7F8FA',
          cream: '#F0F1F5',
        },
        primary: {
          50: '#EEF0F9',
          100: '#D5DAF0',
          200: '#ABB5E1',
          300: '#8190D2',
          400: '#576BC3',
          500: '#1B2A6B',
          600: '#162259',
          700: '#111A47',
          800: '#0C1235',
          900: '#070A23',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['DM Serif Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
