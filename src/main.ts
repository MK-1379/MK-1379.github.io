import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'
import './assets/main.css'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/geist-mono'

export const createApp = ViteSSG(App, { routes, base: import.meta.env.BASE_URL }, ({ head, isClient }) => {
  if (!isClient) head?.push({ htmlAttrs: { lang: 'es' } })
})