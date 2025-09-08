import './assets/main.css'
import 'uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ArcoVue from '@arco-design/web-vue'
import axios from 'axios'
import '@arco-design/web-vue/dist/arco.css'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import i18n from './i18n' // 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import Vant from 'vant'
import 'vant/lib/index.css' // 引入样式
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
// 禁用 Vue DevTools
app.config.devtools = false
app.config.globalProperties.$axios = axios

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(ArcoVue)
app.use(ArcoVueIcon)
app.use(Vant)

app.mount('#app')
