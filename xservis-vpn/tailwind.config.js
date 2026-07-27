/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#15D8EA',
        secondary: '#22C8F5',
        accent: '#2E8BFF',
        glow: '#5CE8FF',
        surface: '#0C1018',
        card: 'rgba(18,24,34,0.82)',
        'text-secondary': '#B8C2D1',
      },
      borderRadius: {
        'glass': '20px',
      },
      backdropBlur: {
        'glass': '24px',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(21,216,234,0.1)' },
          '100%': { boxShadow: '0 0 40px rgba(21,216,234,0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.8 },
        },
      },
    },
  },
  plugins: [],
}
