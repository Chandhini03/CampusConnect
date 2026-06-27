/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#102b29',
        pine: '#123f3a',
        moss: '#1c5c53',
        mint: '#d9ede4',
        cream: '#f7f7f1',
        sun: '#f2a640',
      },
      fontFamily: { sans: ['Manrope', 'sans-serif'], display: ['Outfit', 'sans-serif'] },
      boxShadow: { soft: '0 18px 50px rgba(16, 43, 41, .12)' },
    },
  },
  plugins: [],
}
