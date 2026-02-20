import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        surface: "var(--color-surface)"
      },
      boxShadow: {
        premium: "0 20px 45px rgba(16, 16, 16, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
