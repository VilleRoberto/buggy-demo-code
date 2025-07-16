/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tree-green': '#22c55e',
        'tree-brown': '#92400e',
        'leaf-green': '#16a34a',
        'fruit-red': '#dc2626',
        'sky-blue': '#3b82f6',
        'sun-yellow': '#fbbf24',
      },
      animation: {
        'grow': 'grow 0.5s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'sparkle': 'sparkle 1s ease-in-out infinite',
      },
      keyframes: {
        grow: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
}