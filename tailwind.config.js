/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkpurple: '#271D25',
        lightpurple: '#3B2A38',
        darkyellow : '#B89158',
        lightyellow: '#F1BF76',
      },
    },
  },
  
  plugins: [],
}

