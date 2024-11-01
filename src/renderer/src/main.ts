//import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { setupApp } from '~/logic/common-setup'
import './tailwind-css/'

const app = createApp(App)

setupApp(app)

app.mount('#app')
