/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Be Vietnam Pro", "system-ui", "-apple-system", "sans-serif"],
        serif: ["Source Serif Pro", "serif"],
        heading: ["Be Vietnam Pro", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#16a34a",
        "primary-dull": "#15803d",
        secondary: "#0f5132",
      },
      maxWidth: {
        105: "26.25rem",
      },
      lineHeight: {
        15: "3.75rem",
      },
    },
  },
  plugins: [],
};
