import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: colors.neutral,
        secondary: colors.orange,
        accent: colors.blue,
        success: colors.green,
        warning: colors.orange,
        error: colors.red,
        info: colors.blue,
      },
    },
  },
  plugins: [],
}
