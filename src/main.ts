import './assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { v4 as uuidv4 } from 'uuid';

import App from './App.vue'
import router from './router'
import { createSupabaseClient } from '@/lib/supabase/supabaseClient'

const app = createApp(App)
app.use(createPinia())
app.use(router)

const id = uuidv4();
document.body.insertAdjacentHTML('beforeend', `<div id="arcpay-${id}"></div>`);
app.mount(`#arcpay-${id}`)

import { getListings, getListingById } from '@/lib/supabase/listings'
import { useModalsStore } from '@/stores/modalsStore'
import { useParametersStore } from '@/stores/parametersStore'
import type { SupabaseClient } from '@supabase/supabase-js'

const createClient = createSupabaseClient;
const createListing = () => {}
const updateListing = () => {}
const deleteListing = () => {}

const buy = async (client: SupabaseClient, listing_id: string) => {
  const modals = useModalsStore()
  modals.showModal('root')

  const params = useParametersStore()
  await params.getListingParameters(client, listing_id)
  console.log(params)
}

const bid = () => {}

export {
  createClient,
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  buy,
  bid,
}

