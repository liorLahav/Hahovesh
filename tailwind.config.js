/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}", // 👈 חובה כדי שיראה את המחלקות בקומפוננטות
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#000000", // blue
        "primary-foreground": "#ffffff",
        secondary: "#64748b", // gray
        "secondary-foreground": "#ffffff",
        destructive: "#ef4444", // orange
        "destructive-foreground": "#ffffff",
      },
    },
  },
  plugins: [],
};
