import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      colors: {
        steel: {
          dark: "#2c3e50",
          mid: "#4a6a85",
          DEFAULT: "#8a9ba8",
          light: "#c8d6df",
        },
        gold: {
          DEFAULT: "#c9a84c",
          light: "#f0d98a",
          pale: "#fef9ec",
        },
        cream: {
          DEFAULT: "#f9f6f0",
          dark: "#f0ece4",
        },
      },
      boxShadow: {
        card: "0 2px 8px rgba(44,62,80,0.07)",
        "card-hover": "0 12px 32px rgba(44,62,80,0.13)",
        gold: "0 6px 24px rgba(201,168,76,0.38)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseDot: {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.65)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-12px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseDot: "pulseDot 2s ease-in-out infinite",
        fadeUp: "fadeUp 0.6s ease both",
        slideIn: "slideIn 0.4s ease both",
      },
    },
  },
  plugins: [],
};

export default config