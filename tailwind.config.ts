import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#09090b", card: "#111113", hover: "#1a1a1f", border: "#222228" },
        accent: { DEFAULT: "#8b5cf6", hover: "#a78bfa", dim: "#4c1d95", glow: "rgba(139,92,246,0.15)" },
        sky: { DEFAULT: "#38bdf8", hover: "#7dd3fc" },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
