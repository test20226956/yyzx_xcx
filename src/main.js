import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@vant/touch-emulator'
import Vant from 'vant'
import 'vant/lib/index.css' 

const app = createApp(App);
app.use(Vant)
app.use(Vant.Lazyload)
app.use(router)
app.mount('#app')
