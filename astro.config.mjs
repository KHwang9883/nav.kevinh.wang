import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://nav.kevinh.wang',
  vite: {
    plugins: [tailwindcss()],
  },
})
