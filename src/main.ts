import './assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { v4 as uuidv4 } from 'uuid';

import App from './App.vue'
import router from './router'

import { ArcpayClient, type ArcpayClientOptions} from '@/Client'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)

const id = uuidv4();
document.body.insertAdjacentHTML('beforeend', `<div id="arcpay-${id}"></div>`);
app.mount(`#arcpay-${id}`)

export const useArcpay = (options: ArcpayClientOptions):ArcpayClient => {
  return new ArcpayClient(`arcpay-${id}`, app, options)
}
