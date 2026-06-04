import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#f8f2e7",
        ink: "#2f241c",
        clay: "#944129",
        sand: "#d8c6a7",
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "Times", "serif"],
      },
      boxShadow: {
        soft: "0 14px 30px rgba(42, 30, 18, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
