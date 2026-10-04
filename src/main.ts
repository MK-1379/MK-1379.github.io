import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/source-sans-3'
import '@fontsource/ibm-plex-mono/400.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
