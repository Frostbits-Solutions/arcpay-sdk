import './assets/style.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'
import {v4 as uuidv4} from 'uuid';

import App from './App.vue'
import router, {routerListenStores} from './router'
import {createSupabaseClient} from '@/lib/supabase/supabaseClient'
import {getListingById, getListings} from '@/lib/supabase/listings'
import {useModalsStore} from '@/stores/modalsStore'
import {useParametersStore} from '@/stores/parametersStore'
import type {SupabaseClient} from '@supabase/supabase-js'
import {useTransactionStore} from "@/stores/transactionStore";
import {CONTRACT_TYPE, CONVENTION_TYPE, TRANSACTION_TYPE} from "@/constants";
import {useWalletStore} from "@/stores/walletStore";

const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(router)

const id = uuidv4();
document.body.insertAdjacentHTML('beforeend', `<div id="arcpay-${id}"></div>`);
app.mount(`#arcpay-${id}`)

const createClient = createSupabaseClient;
const createListing = async (client: SupabaseClient, listing_id: string) => {
  const modals = useModalsStore()
  modals.showModal('root')
  const params = useParametersStore()

  const walletStore = useWalletStore()
  const transactionStore = useTransactionStore()
  // @ts-ignore
  transactionStore.walletStore = walletStore
  // @ts-ignore
  transactionStore.parameterStore = params
  transactionStore.transactionType = TRANSACTION_TYPE.create
  transactionStore.contractType = CONTRACT_TYPE.Sale
  transactionStore.conventionType = CONVENTION_TYPE.VoiArc72

  await params.getListingParameters(client, listing_id)
  console.log(params)
  routerListenStores()
}
const updateListing = () => {}
const deleteListing = () => {}

const buy = async (client: SupabaseClient, listing_id: string) => {
  const modals = useModalsStore()
  modals.showModal('root')
  const params = useParametersStore()

  const walletStore = useWalletStore()
  const transactionStore = useTransactionStore()
  // @ts-ignore
  transactionStore.walletStore = walletStore
  // @ts-ignore
  transactionStore.parameterStore = params
  transactionStore.transactionType = TRANSACTION_TYPE.buy
  transactionStore.contractType = CONTRACT_TYPE.Sale

  await params.getListingParameters(client, listing_id)
  console.log(params)

  routerListenStores()
}

const bid = () => {}

import {test} from './test'
test()


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

