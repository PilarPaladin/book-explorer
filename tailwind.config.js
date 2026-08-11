/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ao3: {
          red: '#990000',
          darkred: '#730000',
          bg: '#ffffff',
          text: '#2a2a2a',
          link: '#1a5ebd',
          tagbg: '#f0f0f0',
          border: '#cccccc',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
