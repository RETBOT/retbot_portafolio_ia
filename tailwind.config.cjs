/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#0E131A",
        secondary: "#A9B7C8",
        tertiary: "#161D26",
        "black-100": "#121A24",
        "black-200": "#0A0F16",
        "white-100": "#EAF4FF",
        title: "#22D3EE",
        selected: "#22D3EE",
        no_selected: "#EAF4FF",
        accent: "#2EA8FF",
        surface: "#1A2430",
        
      },
      boxShadow: {
        card: "0 22px 50px -28px rgba(35, 179, 227, 0.45)",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "url('/src/assets/herobg.png')",
      },
    },
  },
  plugins: [],
};
