import type { Config } from 'tailwindcss'

export default <Config>{
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './composables/**/*.{vue,js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: '#2c2e2f',
          hover: '#374140',
          active: '#455a64',
          border: '#3a3c3f',
        },
        card: {
          bg: '#ffffff',
          hover: '#f5f5f5',
          border: '#e6e6e6',
          shadow: 'rgba(0, 0, 0, 0.1)',
        },
        dark: {
          bg: '#2c2e2f',
          card: '#3a3c3f',
          border: '#4a4c4f',
          text: '#a9a9a9',
          textLight: '#d8d8d8',
          hoverShadow: 'rgba(130, 130, 130, 0.13)',
        },
      },
      fontFamily: {
        arimo: ['Arimo', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        'main-content': '1200px',
      },
    },
  },
  plugins: [],
}
