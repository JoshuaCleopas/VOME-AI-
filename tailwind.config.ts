import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          deep: "#104241",
          mid: "#285453",
          light: "#3a6e6d",
          pale: "#e6efee",
        },
        sand: {
          DEFAULT: "#FFD7B4",
          deep: "#f5b97e",
          pale: "#fff3e6",
        },
        ink: {
          DEFAULT: "#0f1f1f",
          muted: "#5a6b6b",
          subtle: "#8a9999",
        },
        surface: {
          DEFAULT: "#fafaf7",
          card: "#ffffff",
          subtle: "#f3f4f1",
        },
        status: {
          good: "#0d9488",
          warn: "#f59e0b",
          bad: "#dc2626",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16, 66, 65, 0.04), 0 4px 12px rgba(16, 66, 65, 0.04)",
        lift: "0 4px 16px rgba(16, 66, 65, 0.08), 0 12px 32px rgba(16, 66, 65, 0.06)",
      },
      animation: {
        "rise": "rise 600ms cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fadeIn 300ms ease-out",
      },
      keyframes: {
        rise: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
