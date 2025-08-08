/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // ⬅️ Add this line
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        animation: {
          fadeIn: "fadeIn 1.5s ease-in-out"
        },
        keyframes: {
          fadeIn: {
            "0%": { opacity: 0 },
            "100%": { opacity: 1 }
          }
        }
      }
    },
    plugins: [
      require('tailwindcss-animate'),
    ],
  }
  