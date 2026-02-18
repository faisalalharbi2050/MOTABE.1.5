import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#655ac1",
          light: "#8779fb",
          subtle: "#e5e1fe",
        },
        secondary: "#8779fb",
        accent: "#e5e1fe",
      },
      fontFamily: {
        sans: ['var(--font-cairo)', 'sans-serif'], // We will use Cairo font
      },
    },
  },
  plugins: [],
};
export default config;
