/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // ⬅️ Add this line
    content: [
      './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {},
    },
    plugins: [
        require('tailwindcss-animate'),
      ],
  }
  