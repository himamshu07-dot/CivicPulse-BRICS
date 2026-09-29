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
        background: "#F8FAFC",
        card: "#FFFFFF",
        primary: "#1E293B",
        accent: "#0F766E",
        "alert-critical": "#E11D48",
        "alert-warn": "#FBBF24",
        "text-main": "#0F172A",
        "text-muted": "#64748B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        serif: ["var(--font-merriweather)", "Merriweather", "serif"],
      },
    },
  },
  plugins: [],
};
