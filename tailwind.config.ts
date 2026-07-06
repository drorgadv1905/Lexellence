import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f0f5f2",
          100: "#dce8e0",
          200: "#b8d1c1",
          300: "#8fb49d",
          400: "#689678",
          500: "#4a7a5c",
          600: "#3a6249",
          700: "#2f4f3c",
          800: "#284033",
          900: "#1e3328",
          950: "#0f1a14",
        },
        cream: {
          50: "#fdfcfa",
          100: "#faf7f2",
          200: "#f5efe6",
          300: "#ebe3d4",
        },
        gold: {
          300: "#dcc68a",
          400: "#c9a962",
          500: "#b8943f",
          600: "#9a7a32",
        },
      },
      fontFamily: {
        heebo: ["Heebo", "Arial", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(30, 51, 40, 0.06), 0 4px 16px rgba(30, 51, 40, 0.04)",
        elevated: "0 8px 30px rgba(30, 51, 40, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
