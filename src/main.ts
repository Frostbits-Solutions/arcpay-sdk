import './assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {v4 as uuidv4} from 'uuid';

import App from './App.vue'
import router from './router'

import { Modal } from '@/Modal'
import { Client } from '@/Client'


const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)

const id = uuidv4();
document.body.insertAdjacentHTML('beforeend', `<div id="arcpay-${id}"></div>`);
app.mount(`#arcpay-${id}`)

const modal:Modal = new Modal(app, `arcpay-${id}`)

import { test } from './test'
test()

export {
  Client,
  modal
}

