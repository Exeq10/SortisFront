/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': "#3A0164",
        'secondary': "#323465",
        'accent': "#6057A8",
        'highlight': "#7E1483",
        'softBlue': "#6469CB",
      },
    },
  },
  plugins: [],
};
