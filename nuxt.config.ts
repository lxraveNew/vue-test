// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt'
  ],
  typescript: {
    strict: true,
    typeCheck: false
  },
  css: ['vuetify/styles'],
  build: {
    transpile: ['vuetify']
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
  ssr: true,
  nitro: {
    compatibilityDate: '2024-03-18'
  },
  compatibilityDate: '2025-03-18'
})
