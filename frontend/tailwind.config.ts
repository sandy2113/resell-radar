import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef9ff",
          100: "#d9f0ff",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
        },
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: [
          "var(--font-outfit)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(8, 47, 73, 0.07), 0 2px 8px rgba(8, 47, 73, 0.04)",
        "glass-lg":
          "0 20px 50px rgba(8, 47, 73, 0.1), 0 4px 16px rgba(8, 47, 73, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
