import type { AppProvider } from '@/lib/app/AppProvider'
import router from '@/router'

export function load(appProvider: AppProvider) {
  appProvider.provide('WalletSelection', {}, ()=>{})
  router.push({name: 'loading'})
}