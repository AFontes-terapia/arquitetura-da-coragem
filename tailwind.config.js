/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#10b981", // esmeralda principal
          light: "#6ee7b7",
          dark: "#047857",
        }
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.08)",
      }
    },
  },
  plugins: [],
}
