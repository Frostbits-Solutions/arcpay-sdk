import {ref} from 'vue'
import {AppProvider} from '@/lib/app/AppProvider'
import {selectWallet} from '@/lib/app/selectWallet'
import {createListing, type CreateListingOptions, type ListingCreationParams} from '@/lib/app/createListing'
import router from '@/router'

export {
  AppProvider,
  selectWallet,
  createListing,
  type CreateListingOptions,
  type ListingCreationParams
}

export function closeDialog() {
  router.push('/')
}

export function load(appProvider: AppProvider, title: string, description: string) {
  appProvider.provide('Load', ref({title, description}), ()=>{}, true)
  router.push({name: 'loading'})
}

export function displayError(appProvider: AppProvider, title: string, description: string, callback: ()=>void) {
  appProvider.provide('Error', {title, description}, callback)
  router.push({name: 'error'})
}

export function success(appProvider: AppProvider, title: string, description: string, callback: ()=>void) {
  appProvider.provide('Success', {title, description}, callback)
  router.push({name: 'success'})
}