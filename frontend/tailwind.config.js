/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Solo Sparks Design System Colors
        primary: {
          50: "#E6FFFF",
          100: "#CCFFFF",
          200: "#99FFFF",
          300: "#66FFFF",
          400: "#33FFFF",
          500: "#00FFFF", // Neon Blue - Primary
          600: "#00E6E6",
          700: "#00CCCC",
          800: "#00B3B3",
          900: "#009999",
        },
        secondary: {
          50: "#F4F0FF",
          100: "#E9E1FF",
          200: "#D3C3FF",
          300: "#BDA5FF",
          400: "#A787FF",
          500: "#B388EB", // Neon Purple - Secondary
          600: "#A277D4",
          700: "#9166BD",
          800: "#8055A6",
          900: "#6F448F",
        },
        accent: {
          50: "#E6FFF4",
          100: "#CCFFE9",
          200: "#99FFD3",
          300: "#66FFBD",
          400: "#33FFA7",
          500: "#1DF2A4", // Aqua Green - Accent
          600: "#1AD994",
          700: "#17C084",
          800: "#14A774",
          900: "#118E64",
        },
        background: {
          50: "#1A1D23",
          100: "#161A20",
          200: "#12161D",
          300: "#0E121A",
          400: "#0A0E17",
          500: "#0D1117", // Main Background
          600: "#090D13",
          700: "#05090F",
          800: "#01050B",
          900: "#000107",
        },
        surface: {
          50: "#1E2228",
          100: "#1A1E24",
          200: "#161A20",
          300: "#12161C",
          400: "#0E1218",
          500: "#0A0E14",
          600: "#060A10",
          700: "#02060C",
          800: "#000208",
          900: "#000004",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#E5E7EB",
          tertiary: "#D1D5DB",
          muted: "#9CA3AF",
        },
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 255, 255, 0.1)",
        "glass-purple": "0 8px 32px 0 rgba(179, 136, 235, 0.1)",
        "glass-green": "0 8px 32px 0 rgba(29, 242, 164, 0.1)",
        "neon-blue": "0 0 20px rgba(0, 255, 255, 0.5)",
        "neon-purple": "0 0 20px rgba(179, 136, 235, 0.5)",
        "neon-green": "0 0 20px rgba(29, 242, 164, 0.5)",
        glow: "0 0 40px rgba(0, 255, 255, 0.3)",
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(0, 255, 255, 0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        glass:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
      },
    },
  },
  plugins: [],
};
