/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  prefix: 'ap-',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'slide-in-bottom': 'slide-in-bottom .5s var(--ease-spring-2) forwards',
        'modal': 'slide-in-bottom .5s var(--ease-spring-2) both .2s',
        'blur': 'blur .2s linear forwards',
      },
      keyframes: {
        'slide-in-bottom': {
          '0%': { transform: 'translateY(10vh)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'blur': {
          '0%': { backdropFilter: 'blur(0)', opacity: 0 },
          '100%': { backdropFilter: 'blur(4px)', opacity: 1 },
        }
      }
    },
  },
  plugins: [],
}