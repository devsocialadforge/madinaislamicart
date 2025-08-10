/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "serif"],
        heading: ["Poppins", "sans-serif"],
      },
      colors: {
        // Amazon-inspired custom colors
        "amazon-orange": "#ff9900",
        "amazon-blue": "#146eb4",
        "amazon-black": "#131921",
        "amazon-dark-gray": "#232f3e",
        "amazon-light-gray": "#f3f3f3",

        // ... rest of your existing colors
      },
      // ... rest of your config
    },
  },
  plugins: [],
};
