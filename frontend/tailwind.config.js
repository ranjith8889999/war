/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideIn: 'slideInLeft 0.6s ease-out',
      },
    },
  },
  plugins: [],
}
