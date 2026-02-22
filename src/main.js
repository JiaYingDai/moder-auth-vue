import './assets/main.css'
import './assets/vue-toastification.css'
import '@mdi/font/css/materialdesignicons.css'
import i18n from '../src/i18n/i18n'
import vuetify from '../src/plugins/vuetify'
import Toast from "vue-toastification"
import 'vue-toastification/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const ToastOptions = {
    transition: "Vue-Toastification__fade",
    maxToasts: 10,
    newestOnTop: true
}
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(vuetify)
app.use(Toast, ToastOptions)

app.mount('#app')
