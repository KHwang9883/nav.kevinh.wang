// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-06-16',

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
  ],

  app: {
    head: {
      title: 'Kevin Huang 的导航站 - 亲选软件与资源',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Kevin Huang 的个人导航站，亲选软件与资源' },
        { name: 'keywords', content: '导航站,软件,工具,游戏,Kevin Huang' },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: 'Kevin Huang 的导航站 - 亲选软件与资源' },
        { property: 'og:description', content: 'Kevin Huang 的个人导航站，亲选软件与资源' },
        { property: 'og:site_name', content: 'Kevin Huang 的导航站' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Kevin Huang 的导航站 - 亲选软件与资源' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' },
      ],
    },
  },

  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
  },

  css: [
    '~/assets/css/main.css',
  ],

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
    },
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router'],
          },
        },
      },
    },
  },

  devtools: { enabled: false },
})
