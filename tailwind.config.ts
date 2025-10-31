import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#8ddeed",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "#8ddeed",
          foreground: "hsl(var(--accent-foreground))",
        },
        warning: {
          DEFAULT: "#fcf300",
          foreground: "#072ac8",
        },
        success: {
          DEFAULT: "#ffc600",
          foreground: "#072ac8",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // New CSS variables from your class names
        plain: "hsl(var(--plain))",
        tertiary: "hsl(var(--tertiary))",
        indicate: "hsl(var(--indicate))",
        menu: "hsl(var(--menu))",
        bg: "hsl(var(--bg))",
        "chat-ui": "hsl(var(--chat-ui))",
        "chat-ui-base": "hsl(var(--chat-ui-base))",
        // Custom color palette
        "light-bg": "#fafafa",
        "light-card": "#ffffff",
        "dark-bg": "#010B13",
        "primary-purple": "#7037e4",
        "accent-cyan": "#8ddeed",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.95)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "expand-custom-width": {
          '0%': { width: '0' },
          '100%': { width: '50%' },
        },
        "expand-custom-height": {
          '0%': { Height: '0' },
          '100%': { Height: '50%' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        shimmer: "shimmer 2s infinite",
        "expand-custom-width": 'expand-custom-width 300ms ease-in-out forwards',
        "expand-custom-height": 'expand-custom-height 300ms ease-in-out forwards',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
} satisfies Config;

export default config;