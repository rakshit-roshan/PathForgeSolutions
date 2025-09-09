/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: { 
        center: true, 
        padding: '1rem' 
      },
      colors: {
        brand: { 
          50: '#eef2ff', 
          100: '#e0e7ff', 
          600: '#4f46e5', 
          700: '#4338ca' 
        },
        accent: { 
          500: '#06b6d4' 
        }
      }
    },
  },
  plugins: [],
}