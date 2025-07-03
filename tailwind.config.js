/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // (optional, for Next.js 13+)
  ],
  theme: {
    extend: {
      fontSize: {
        'xxs': '0.65rem',
      }
    },
  },
  plugins: [],
}
