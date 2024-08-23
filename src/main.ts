import './assets/style.css'
import { createApp } from 'vue'
import { v4 as uuidv4 } from 'uuid';
import App from './App.vue'
import router from './router'
import { ArcpayClient, type ArcpayClientOptions} from '@/Client'

let client: undefined | ArcpayClient
export const useArcpay = (options: ArcpayClientOptions):ArcpayClient => {
  return (() => {
    if (!client) {
      const app = createApp(App)
      app.use(router)

      const id = uuidv4();
      document.body.insertAdjacentHTML('beforeend', `<div id="arcpay-${id}"></div>`);
      app.mount(`#arcpay-${id}`)
      client = new ArcpayClient(`arcpay-${id}`, app, options)
    }
    return client
  })()
}