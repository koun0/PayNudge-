/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe8ff",
          600: "#3159d4",
          700: "#2746ad",
          800: "#243b88",
          900: "#202f68",
        },
        ink: "#172033",
        muted: "#667085",
      },
      boxShadow: {
        card: "0 18px 45px rgba(15, 23, 42, 0.07)",
        lift: "0 24px 70px rgba(15, 23, 42, 0.12)",
        soft: "0 1px 2px rgba(15, 23, 42, 0.06), 0 12px 36px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
