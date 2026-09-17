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
          signalRed: "#ED1B24",
          deepRed: "#B52229",
          charcoal: "#312F30",
          nearBlack: "#111111",
          lightGray: "#F2F2F2",
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
