/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#6C63FF",
        brandAlt: "#00D4FF",
        bg: "#0F1224",
        card: "rgba(255,255,255,0.08)",
        text: "#E8EAF6",
        muted: "#A6A8B5",
        success: "#22c55e",
        warn: "#f59e0b",
        danger: "#ef4444",
      },
      borderRadius: {
        xl: "28px",
        lg: "20px",
        md: "14px",
      },
    },
  },
  plugins: [],
};
