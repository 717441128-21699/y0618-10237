/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        lg: "2.5rem",
        xl: "3.5rem",
      },
    },
    extend: {
      colors: {
        ink: {
          950: "#070605",
          900: "#0E0D0C",
          850: "#14110F",
          800: "#1B1714",
          700: "#272019",
          600: "#3A2F24",
          500: "#54432F",
        },
        amber: {
          50: "#FBF4E4",
          100: "#F6E8C8",
          200: "#EFD496",
          300: "#E8B04B",
          400: "#D99A2E",
          500: "#B97A1E",
          600: "#8C5A18",
        },
        coral: {
          50: "#FEECEA",
          100: "#FDD2CE",
          200: "#FBA8A1",
          300: "#FF6B5B",
          400: "#E84A38",
          500: "#C03323",
        },
        cream: {
          50: "#FBF8F1",
          100: "#F5F0E8",
          200: "#EAE2D4",
          300: "#D8CCB8",
          400: "#B8A98E",
        },
        forest: {
          300: "#7FB069",
          400: "#5C9447",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      fontSize: {
        "10xl": ["10rem", { lineHeight: "0.9" }],
        "11xl": ["14rem", { lineHeight: "0.85" }],
      },
      letterSpacing: {
        tightest: "-0.05em",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(232,176,75,0.45)",
        "glow-coral": "0 0 40px -10px rgba(255,107,91,0.45)",
        deep: "0 30px 60px -20px rgba(0,0,0,0.7)",
        inset: "inset 0 1px 0 0 rgba(255,255,255,0.06)",
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(-2deg)" },
          "50%": { transform: "translateY(-18px) rotate(2deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.9" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "spin-slow": "spinSlow 24s linear infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
