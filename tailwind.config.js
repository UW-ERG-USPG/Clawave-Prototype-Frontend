/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Open Sans"', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        textGray: '#343A40',
        baseBlue: '#4A90E2',
        baseGreen: '#50C878',
        bgWhite: '#F8F9FA',
        accentYellow: '#FFD700'
      },
    },
  },
  plugins: [],
}

