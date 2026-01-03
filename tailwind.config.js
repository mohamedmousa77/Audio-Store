/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#f49d25",        // L'arancione del tuo design
        "primary-dark": "#d68310",
        "background-light": "#f8f7f5",
        "background-dark": "#221a10",
        "surface-light": "#ffffff",
        "surface-dark": "#2d2418",
        "text-main": "#1c160d",
        "text-muted": "#9c7a49",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}