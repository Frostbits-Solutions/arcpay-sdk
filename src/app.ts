import router from '@/router'
import type { Wallet, Account } from '@/lib/wallets'
import type { App } from 'vue'

interface AppProviderArgs { [key: string]: any }
interface AppProviderCallback { (...args: any[]): void }
interface AppProviderProvider {
[key: string]: {
    args: AppProviderArgs,
    callback: AppProviderCallback
  }
}

export class AppProvider {
  private readonly _app: App
  private readonly _provider: AppProviderProvider

  constructor(app: App) {
    this._app = app
    this._provider = {}
    this._app.provide('appProvider', this._provider)
  }

  provide(key: string, args: AppProviderArgs, callback: AppProviderCallback) {
    this._provider[key] = {args, callback}
  }
}

export interface WalletSelection {
  wallet: Wallet,
  account: Account
}

export function selectWallet(appProvider: AppProvider) {
  return new Promise<WalletSelection>((resolve, reject) => {
    appProvider.provide('WalletSelection', {}, (selection: WalletSelection, error?: Error) => {
      if (error) reject(error)
      resolve(selection)
    })
    router.push({name: 'wallet-selection'})
  })
}

export interface GetListingParamsOptions {
  assetId?: string
  listingName?: string
}

export interface ListingCreationParams {

}

export function getListingParams(appProvider: AppProvider, account: Account, options?: GetListingParamsOptions) {
  return new Promise<ListingCreationParams>((resolve, reject) => {
    appProvider.provide('ListingCreation', {account, options}, (params: ListingCreationParams, error?: Error) => {
      if (error) reject(error)
      resolve(params)
    })
    router.push({name: 'listing-creation'})
  })
}