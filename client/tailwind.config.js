/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "serif"],
        lato: ["Lato", "serif"],
      },
      colors: {
        blue_100: "#007FD4",
        blue_200: "#0066AA",
        blue_300: "#004C7F",
        blue_400: "#003355",
        gray: "#424242",
        black: "#0F1014",
        white: "#FFFFFF",
        red: "#DB2828",
        yellow: "#FDD835",
        green: "#21BAA5",
      },
    },
  },
  plugins: [],
}