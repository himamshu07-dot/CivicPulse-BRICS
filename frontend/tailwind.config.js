/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090909",
        surface: "#111111",
        "surface-card": "#161616",
        "surface-card-hover": "#1f1f1f",
        border: "#282828",
        "border-glow": "#39FF14",
        primary: "#FFFFFF",
        accent: "#39FF14", // Neon Hacker Green
        "accent-bright": "#a3ff00",
        "accent-muted": "#228b22",
        "alert-critical": "#FF3366",
        "alert-warn": "#FFCC00",
        "text-main": "#F0F0F0",
        "text-muted": "#A0A0A0",
        "text-dim": "#666666",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-fira-code)", "var(--font-jetbrains-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        neon: "0 0 15px -2px rgba(57, 255, 20, 0.4)",
        "neon-lg": "0 0 25px -4px rgba(57, 255, 20, 0.6)",
        "neon-sm": "0 0 8px -2px rgba(57, 255, 20, 0.3)",
      },
    },
  },
  plugins: [],
};

