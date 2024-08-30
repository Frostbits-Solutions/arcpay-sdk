import { createSupabaseClient, deriveAccountIdFromKey } from '@/lib/supabase/supabaseClient'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { NetworksConfig, PublicNetwork, VoiPublicNetwork } from '@/lib/algod/networks.config'
import { networksConfig } from '@/lib/algod/networks.config'
import type { App } from 'vue'
import {
  AppProvider,
  closeDialog,
  createListing,
  type CreateListingOptions,
  displayError,
  type ListingCreationParams,
  load,
  selectWallet,
  success
} from '@/lib/app'
import { type SupportedWallet, type WalletAccount, WalletManager} from '@txnlab/use-wallet'
import { interfaces, type VoiInterface } from '@/lib/contracts/interfaces'
import {createAuction, createSale, getListingById, getListings} from '@/lib/supabase/listings'
import type {ListingType} from '@/lib/app/createListing'
import type { TransactionConfirmation } from '@/lib/transaction/Transaction'
import { reviewListing } from '@/lib/app/reviewListing'
import {createApp} from "@/lib/contracts/createApp";

export interface ArcpayClientOptions {
  apiKey?: string,
  client?: SupabaseClient,
  darkMode?: boolean
}

export interface CreateOptions {
  assetId?: string
  listingType?: ListingType
  listingName?: string
  accountId?: number
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

  constructor(modalId: string, app: App, network: PublicNetwork, options: ArcpayClientOptions) {
    if (!network) throw new Error('Network is required')
    if (!networksConfig[network]) throw new Error(`Network ${network} is not supported`)
    this._id = modalId
    this._app = app
    this._appProvider = new AppProvider(app)
    this._networkConfig = networksConfig[network]
    this._walletManager = new WalletManager({
      wallets: networksConfig[network].walletProviders as SupportedWallet[],
      network: networksConfig[network].networkId,
      algod: {
        token: '',
        baseServer: networksConfig[network].nodeBaseURL,
        port: networksConfig[network].nodePort
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
    this._app.provide('appProvider', this._appProvider)
  }

  public getWalletManager() {
    return this._walletManager
  }
  public getNetworkConfig() {
    return this._networkConfig
  }
  public getClient() {
    return this._client
  }
  public getAppProvider() {
    return this._appProvider
  }

  public toggleDarkMode(bool?: boolean) {
    document.getElementById(this._id)?.classList.toggle('ap-dark', bool)
  }

  public async getListings() {
    return await getListings(this._client)
  }

  public async getListingById(id: string) {
    return await getListingById(this._client, id)
  }

  public async create(options?: CreateOptions) {
    let accountId = options?.accountId

    // WARNING: account_id can be 0
    if (typeof accountId === 'undefined') {
      const { data, error } = await deriveAccountIdFromKey(this._client, this._apiKey as string)
      if (error) throw new Error(`Unable to derive account ID from key. ${error.message}`)
      accountId = data
    }

    if (typeof accountId === 'undefined') throw new Error('Unexpected error: Account ID is undefined')
    try {
      const account: WalletAccount = await selectWallet(this._appProvider)
      const params: ListingCreationParams = await createListing(this._appProvider, account, options satisfies CreateListingOptions | undefined)
      // Create application
      const appIndex = await createApp(this._networkConfig, this._appProvider, this._walletManager, this._client, accountId, account, params)
      // Save listing in DB
      let listingId: string | undefined
      if (params.type === 'sale') {
        const { data, error } = await createSale(
            this._client,
            accountId,
            appIndex,
            'Unknown',
            params.asset.id,
            1,
            params.asset.thumbnail,
            params.asset.type,
            this._networkConfig.key,
            params.currency?.id || '0',
            options?.listingName || params.asset.name || params.asset.id,
            account.address,
            options?.tags?.join(', ') || null,
            params?.price
        )
        if (error) throw new Error(`Error creating sale: ${error.message}`)
        listingId = data?.[0]?.listing_id
      }
      else if (params.type === 'auction') {
        const { data, error } = await createAuction(
            this._client,
            accountId,
            appIndex,
            'Unknown',
            params.asset.id,
            1,
            params.asset.thumbnail,
            params.asset.type,
            this._networkConfig.key,
            params.currency?.id || '0',
            options?.listingName || params.asset.name || params.asset.id,
            account.address,
            options?.tags?.join(', ') || null,
            params.duration,
            params.price,
            null,
            1,
            'english'
        )
        if (error) throw new Error(`Error creating auction: ${error.message}`)
        listingId = data?.[0]?.listing_id
      }
      else if (params.type === 'dutch') {
        const { data, error } = await createAuction(
            this._client,
            accountId,
            appIndex,
            'Unknown',
            params.asset.id,
            1,
            params.asset.thumbnail,
            params.asset.type,
            this._networkConfig.key as VoiPublicNetwork,
            params.currency?.id || '0',
            options?.listingName || params.asset.name || params.asset.id,
            account.address,
            options?.tags?.join(', ') || null,
            params.duration,
            params.priceMin,
            params.priceMax,
            1,
            'dutch'
        )
        if (error) throw new Error(`Error creating dutch auction: ${error.message}`)
        listingId = data?.[0]?.listing_id
        console.log(data)
      }

      if (!listingId) throw new Error(`Unexpected error: Listing ID is undefined`)
      success(this._appProvider, 'Listing created', 'Your listing has been created successfully.', () => {
        closeDialog()
      })
      return listingId
    } catch (error) {
      //@ts-ignore
      const message = error.message || 'Unknown Error'
      displayError(this._appProvider, 'Error creating listing', message, () => {
        closeDialog()
      })
      throw error
    }
  }

  public async buy(id: string): Promise<TransactionConfirmation | undefined> {
    try {
      const { data: listingParams, error } = await getListingById(this._client, id)
      if (error) throw new Error(`Unable to fetch listing: ${error.message}`)

      if (listingParams && listingParams.asset_id && listingParams.listing_type === 'sale') {
        await reviewListing(this._appProvider, listingParams)
        const account: WalletAccount = await selectWallet(this._appProvider)
        const chain = interfaces[this._networkConfig.chain] as VoiInterface
        const currency = listingParams.listing_currency !== '0' ? 'arc200' : 'voi'
        const [nftAppId, _] = listingParams.asset_id.split('/')
        load(this._appProvider, 'Awaiting transaction confirmation', 'Please check your wallet and sign the transaction.')
        const transactionConfirmation: TransactionConfirmation = await chain[currency]['arc72']['sale'].buy(
          this._walletManager.algodClient,
          this._walletManager.transactionSigner,
          account.address,
          parseInt(nftAppId),
          listingParams.app_id,
          listingParams.seller_address,
          listingParams.asking_price,
          'ZTVMV2EQNUU3HJQ3HUPBLXMPD3PLVQGCJ4SDGOM4BU2W4554UTMPDQ2TTU',
          54881294,
        )
        success(this._appProvider, 'NFT purchased!', 'Check your wallet', () => {
          closeDialog()
        })
        return transactionConfirmation
      }
    } catch (error) {
      //@ts-ignore
      const message = error.message || 'Unknown Error'
      displayError(this._appProvider, 'Error', message, () => {
        closeDialog()
      })
      throw error
    }
  }
}
