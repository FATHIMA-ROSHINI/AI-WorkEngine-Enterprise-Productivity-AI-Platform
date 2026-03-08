import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Vibrant Pastel Palette for Bold Brutalism
        pastel: {
          lavender: "#C7D2FE", 
          mint: "#6EE7B7",
          peach: "#FDBA74",
          sky: "#7DD3FC",
          rose: "#F9A8D4",
          yellow: "#FDE047",
        },
        // Neo-Modern Core
        neo: {
          bg: "var(--bg)",
          surface: "var(--surface)",
          border: "var(--border)",
          accent: "var(--accent)",
          text: "var(--text)",
          muted: "var(--slate)",
        }
      },
      backgroundImage: {
        "mesh-gradient": "radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)",
        "pastel-mesh": "radial-gradient(at 0% 0%, rgba(199, 210, 254, 0.6) 0, transparent 50%), radial-gradient(at 50% 0%, rgba(110, 231, 183, 0.6) 0, transparent 50%), radial-gradient(at 100% 0%, rgba(253, 186, 116, 0.6) 0, transparent 50%)",
      },
      boxShadow: {
        "brutalist": "6px 6px 0px 0px rgba(0,0,0,1)",
        "brutalist-lg": "12px 12px 0px 0px rgba(0,0,0,1)",
        "brutalist-white": "6px 6px 0px 0px rgba(255,255,255,1)",
        "brutalist-accent": "6px 6px 0px 0px var(--accent)",
        "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
      },
      borderRadius: {
        "neo": "0px", 
        "soft": "32px", 
      }
    },
  },
  plugins: [],
};
export default config;
