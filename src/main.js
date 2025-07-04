import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@vant/touch-emulator'
import Vant from 'vant'
import 'vant/lib/index.css'
import { ConfigProvider } from "vant";

const app = createApp(App);
app.use(ElementPlus)
app.use(Vant)

app.use(ConfigProvider)
app.use(router)
app.mount('#app')
