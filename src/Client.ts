import { createSupabaseClient } from '@/lib/supabase/supabaseClient'
import type { SupabaseClient } from '@supabase/supabase-js'
import { AlgodClient } from '@/lib/algod/AlgodClient'
import type { PublicNetwork } from '@/lib/algod/network.config'
import type { App } from 'vue'
import { AppProvider, getListingParams, type GetListingParamsOptions, selectWallet } from '@/app'

export interface ArcpayClientOptions {
  network: PublicNetwork
  apiKey?: string,
  client?: SupabaseClient,
  darkMode?: boolean
}

interface CreateListingOptions {
  assetId?: string
  listingName?: string
  accountId?: number
}

export class ArcpayClient {
  private readonly _id: string
  private readonly _app: App
  private readonly _appProvider: AppProvider
  private readonly _apiKey: string | undefined
  private readonly _client: SupabaseClient
  private readonly _algod: AlgodClient

  constructor(modalId: string, app: App, options: ArcpayClientOptions ) {
    this._id = modalId
    this._app = app
    this._appProvider = new AppProvider(app)
    this._algod = new AlgodClient(options.network)

    if (options.client) {
      this._client = options.client
    } else {
      if (!options.apiKey) throw new Error('API key is required')
      this._client = createSupabaseClient(options.apiKey)
      this._apiKey = options.apiKey
    }

    if (options.darkMode) {
      this.toggleDarkMode(options.darkMode)
    }

    this._app.provide('algod', this._algod)
    this._app.provide('supabase', this._client)
  }

  private async _deriveAccountIdFromKey() {
    if (this._apiKey) {
      return this._client.rpc('get_key_account_id', {
        key: this._apiKey,
        origin: window.location.origin
      })
    }
    throw new Error('Unable to derive account ID from key. No API key provided.')
  }

  public toggleDarkMode(bool?: boolean) {
    document.getElementById(this._id)?.classList.toggle('ap-dark', bool)
  }

  public async createListing(options?:CreateListingOptions) {
    let accountId = options?.accountId

    // WARNING: account_id can be 0
    if (typeof accountId === 'undefined') {
      const { data, error } = await this._deriveAccountIdFromKey()
      if (error) {
        throw new Error(`Unable to derive account ID from key. ${error.message}`)
      }
      accountId = data
    }

    const { wallet, account } = await selectWallet(this._appProvider)
    const params = await getListingParams(this._appProvider, account, options satisfies GetListingParamsOptions | undefined)
  }
}
