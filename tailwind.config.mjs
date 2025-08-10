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
        // Brand custom colors
        "sunrise-amber": "#ff9a1a",
        "midnight-slate": "#141a24",
        "ironstone-gray": "#263445",
        "ocean-crest": "#157fc0",
        "cloud-mist": "#f5f5f5",
        "porcelain-white": "#ffffff",

        // ... rest of your existing colors
      },
      // ... rest of your config
    },
  },
  plugins: [],
};
