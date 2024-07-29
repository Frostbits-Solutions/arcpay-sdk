import { createSupabaseClient } from '@/lib/supabase/supabaseClient'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { NetworksConfig, PublicNetwork } from '@/lib/algod/networks.config'
import type { App } from 'vue'
import { AppProvider, createListing, type CreateListingOptions, selectWallet } from '@/lib/app'
import { type SupportedWallet, WalletManager } from '@txnlab/use-wallet'
import {networksConfig} from "@/lib/algod/networks.config";
import {interfaces} from '@/lib/contracts/interfaces'
import getContract from '@/lib/contracts/contracts'
import { createSale } from '@/lib/supabase/listings'

export interface ArcpayClientOptions {
  network: PublicNetwork
  apiKey?: string,
  client?: SupabaseClient,
  darkMode?: boolean
}

interface CreateOptions {
  assetId?: string
  listingName?: string
  accountId?: number,
  tags?: string[]
}

export class ArcpayClient {
  private readonly _id: string
  private readonly _app: App
  private readonly _appProvider: AppProvider
  private readonly _apiKey: string | undefined
  private readonly _client: SupabaseClient
  private readonly _networkConfig: NetworksConfig
  private readonly _walletManager: WalletManager

  constructor(modalId: string, app: App, options: ArcpayClientOptions ) {
    this._id = modalId
    this._app = app
    this._appProvider = new AppProvider(app)
    this._networkConfig =  networksConfig[options.network]
    this._walletManager = new WalletManager({
      wallets: networksConfig[options.network].walletProviders as SupportedWallet[],
      network: networksConfig[options.network].networkId,
      algod: {
        token: '',
        baseServer: networksConfig[options.network].nodeBaseURL,
        port: networksConfig[options.network].nodePort
      }
    })

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

    this._app.provide('walletManager', this._walletManager)
    this._app.provide('network', this._networkConfig)
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

  public async create(options?:CreateOptions) {
    let accountId = options?.accountId

    // WARNING: account_id can be 0
    if (typeof accountId === 'undefined') {
      const { data, error } = await this._deriveAccountIdFromKey()
      if (error) {
        throw new Error(`Unable to derive account ID from key. ${error.message}`)
      }
      accountId = data
    }

    const account = await selectWallet(this._appProvider)
    const params = await createListing(this._appProvider, account, options satisfies CreateListingOptions | undefined)
    console.log(params)
    const chain = this._networkConfig.chain
    const currency = params.currency?.id ? chain : params.currency?.id
    const [nftAppId, nftId] = params.asset.id.split('/')
    if (params.type === 'sale') {
      try {
        const transactionConfirmation = await interfaces[chain][currency]['arc72']['sale'].create(
          this._walletManager.algodClient,
          this._walletManager.transactionSigner,
          account.address,
          parseInt(nftAppId),
          parseInt(nftId),
          params.price,
          await getContract(`${this._networkConfig.key}:voi_arc72_sale_approval:latest`),
          await getContract(`${this._networkConfig.key}:clear:latest`),
          "5ETIOFVHFK6ENLN4X2S6IC3NJOM7CYYHHTODGEFSIDPUW3TSA4MJ3RYSDQ",
          1,
        )
        if (transactionConfirmation.appIndex && accountId) {
          const { data, error } = await createSale(
            this._client,
            accountId,
            transactionConfirmation.appIndex,
            "Unknown",
            params.asset.id,
            1,
            params.asset.thumbnail,
            'ARC72',
            this._networkConfig.key,
            params.currency?.id || 0,
            params.asset.name || params.asset.id,
            account.address,
            options?.tags || null,
            params.price
          )
          if (error) {
            throw new Error(`Unable to create Sale: ${error.message}`)
          }
          return data
        } else {
          throw new Error('New contract appIndex is undefined')
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
}
