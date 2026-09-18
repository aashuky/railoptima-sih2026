/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        rail: {
          deepBlue: "#0B3D91",
          navDark: "#071F4D",
          skyBlue: "#1976D2",
          aiPurple: "#7C3AED",
          green: "#16A34A",
          amber: "#F59E0B",
          criticalRed: "#DC2626",
          lightGray: "#F5F7FA",
          cardWhite: "#FFFFFF",
          darkNavy: "#172033",
          signalRed: "#DC2626",
          charcoal: "#312F30",
          nearBlack: "#111111",
          midGray: "#CCCCCC",
          gray: "#999999"
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"]
      }
    }
  },
  plugins: []
};
