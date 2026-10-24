/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cocoa: {
          50: '#fbf8f5',
          100: '#f5eee6',
          200: '#ebdccd',
          300: '#d9beaa',
          400: '#bf997f',
          500: '#a37559',
          600: '#8c5d44',
          700: '#6b432f',
          800: '#4a2517',
          900: '#3e1d13',
          950: '#1e0d06',
        },
        caramel: {
          50: '#fdf9f0',
          100: '#fbf1dd',
          200: '#f6dfb7',
          300: '#eec787',
          400: '#e4ac5a',
          500: '#d49a43',
          600: '#c58b35',
          700: '#a16d29',
          800: '#835626',
          900: '#6d4722',
        },
        cream: '#fdfbf7',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      aspectRatio: {
        '4/3': '4 / 3',
        '16/10': '16 / 10',
        '16/9': '16 / 9',
        square: '1 / 1',
      },
    },
  },
  plugins: [],
}
