/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // Enables class-based dark mode
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./node_modules/@shadcn/ui/**/*.js", // Include shadcn UI components
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "#ffffff", // White background
        foreground: "#000000", // Black foreground (text)
        card: {
          DEFAULT: "#f8f9fa", // Light gray card background
          foreground: "#000000", // Black card text
        },
        popover: {
          DEFAULT: "#ffffff", // White popover background
          foreground: "#000000", // Black popover text
        },
        primary: {
          DEFAULT: "#000000", // Black button background
          foreground: "#ffffff", // White button text
        },
        secondary: {
          DEFAULT: "#d1d5db", // Light gray secondary button
          foreground: "#000000", // Black text
        },
        muted: {
          DEFAULT: "#e5e7eb", // Very light gray muted color
          foreground: "#6b7280", // Darker gray text
        },
        accent: {
          DEFAULT: "#9ca3af", // Medium gray accent
          foreground: "#ffffff", // White text
        },
        destructive: {
          DEFAULT: "#000000", // Black destructive background
          foreground: "#ffffff", // White destructive text
        },
        border: "#e5e7eb", // Light gray borders
        input: "#ffffff", // White input background
        ring: "#d1d5db", // Light gray focus ring
        chart: {
          "1": "#6b7280", // Gray shades for charts
          "2": "#9ca3af",
          "3": "#d1d5db",
          "4": "#e5e7eb",
          "5": "#f9fafb",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Font for consistent design
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // Ensure animations are applied
  ],
};
