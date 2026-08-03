/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        dark: {
          bg: '#0a0e17',
          surface: '#0f172a',
          card: '#131d31',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        cyanAccent: {
          DEFAULT: '#06b6d4',
          light: '#22d3ee',
          glow: 'rgba(6, 182, 212, 0.25)',
        },
        brand: {
          dark: '#0a0e17',
          card: '#0f172a',
          accent: '#22d3ee',
          neonGreen: '#10b981',
          neonBlue: '#06b6d4',
          neonRed: '#f43f5e',
          darkRed: '#881337',
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'float': 'float 3s infinite ease-in-out',
        'shine': 'shine 1.5s infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(34, 211, 238, 0.25)' },
          '50%': { boxShadow: '0 0 30px rgba(34, 211, 238, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shine: {
          '100%': { left: '125%' },
        }
      }
    },
  },
  plugins: [],
}
