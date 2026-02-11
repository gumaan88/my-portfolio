/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a0f1c',
          800: '#111827',
          700: '#1f2937',
        },
        electric: {
          400: '#22d3ee', // Cyan
          500: '#06b6d4',
          600: '#0891b2',
        },
        primary: '#0f172a',
      },
      fontFamily: {
        sans: ['IBM Plex Sans Arabic', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'glow-gradient': 'radial-gradient(circle at center, rgba(34, 211, 238, 0.15) 0%, rgba(10, 15, 28, 0) 70%)',
      }
    },
  },
  plugins: [],
}