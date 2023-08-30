import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import ElmentPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(ElmentPlus)
app.mount('#app')
