import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'
import './assets/main.css'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/source-sans-3'
import '@fontsource/ibm-plex-mono/400.css'

export const createApp = ViteSSG(App, { routes, base: import.meta.env.BASE_URL })