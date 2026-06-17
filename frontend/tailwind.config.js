/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        doc: {
          bg: '#F4F7FE',
          primary: '#2D7FF9',
          'primary-dark': '#1A73E8',
          'primary-light': '#E8F0FE',
          teal: '#4FD1C5',
          navy: '#1B2559',
          muted: '#A3AED0',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(112, 144, 176, 0.12)',
        float: '0 8px 32px rgba(112, 144, 176, 0.18)',
      },
    },
  },
  plugins: [],
};
