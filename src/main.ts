import './assets/style.css'
import { createApp } from 'vue'
import { v4 as uuidv4 } from 'uuid';
import App from './App.vue'
import router from './router'
import { ArcpayClient, type ArcpayClientOptions} from '@/Client'
import type {PublicNetwork} from "@/lib/algod/networks.config";

type Clients = Partial<Record<PublicNetwork,ArcpayClient>>

const clients: Clients = {}
export const createClient = (network: PublicNetwork, options: ArcpayClientOptions): ArcpayClient => {
  return (() => {
    if (!clients[network]) {
      const app = createApp(App)
      app.use(router)

      const id = uuidv4();
      document.body.insertAdjacentHTML('beforeend', `<div id="arcpay-${id}"></div>`);
      app.mount(`#arcpay-${id}`)
      clients[network] = new ArcpayClient(`arcpay-${id}`, app, network, options)
    }
    return clients[network] as ArcpayClient
  })()
}

export const useArcpay = (network: PublicNetwork):ArcpayClient => {
  return (() => {
    if (!clients[network]) throw new Error(`No client initialized for network ${network}. Please call createClient first.`)
    return clients[network] as ArcpayClient
  })()
}