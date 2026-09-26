/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0e0e0e',
        bg2: '#161616',
        bg3: '#1d1d1d',
        bg4: '#242424',
        red: { DEFAULT: '#d4242a', light: '#ff3b3b' },
        gold: { DEFAULT: '#f0c14b', dark: '#d4af37' },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,.45)',
        deep: '0 20px 50px rgba(0,0,0,.6)',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.4, transform: 'scale(0.7)' },
        },
      },
      animation: {
        pulseSoft: 'pulseSoft 2s infinite',
      },
    },
  },
  plugins: [],
};
