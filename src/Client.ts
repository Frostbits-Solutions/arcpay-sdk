import { createSupabaseClient } from '@/lib/supabase/supabaseClient'
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
import getContract from '@/lib/contracts/contracts'
import { createSale, getListingById } from '@/lib/supabase/listings'
import type { ListingType } from '@/lib/app/createListing'
import type { TransactionConfirmation } from '@/lib/transaction/Transaction'
import { reviewListing } from '@/lib/app/reviewListing'

export interface ArcpayClientOptions {
  network: PublicNetwork
  apiKey?: string,
  client?: SupabaseClient,
  darkMode?: boolean
}

interface CreateOptions {
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

  constructor(modalId: string, app: App, options: ArcpayClientOptions) {
    this._id = modalId
    this._app = app
    this._appProvider = new AppProvider(app)
    this._networkConfig = networksConfig[options.network]
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

  public async create(options?: CreateOptions) {
    let accountId = options?.accountId

    // WARNING: account_id can be 0
    if (typeof accountId === 'undefined') {
      const { data, error } = await this._deriveAccountIdFromKey()
      if (error) {
        throw new Error(`Unable to derive account ID from key. ${error.message}`)
      }
      accountId = data
    }

    if (typeof accountId === 'undefined') throw new Error('Unexpected error: Account ID is undefined')
    try {
      const account: WalletAccount = await selectWallet(this._appProvider)
      const params: ListingCreationParams = await createListing(this._appProvider, account, options satisfies CreateListingOptions | undefined)
      let listingId: string | undefined
      if (params.type === 'sale') {
        if (this._networkConfig.chain !== 'voi') throw new Error(`${this._networkConfig.chain} network is not supported`)
        const { data, error } = await this._createVoiSale(accountId, account, params, options)
        if (error) throw new Error(`Error creating sale: ${error.message}`)
        listingId = data?.[0]?.listing_id
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

  private async _createVoiSale(accountId: number, account: WalletAccount, params: ListingCreationParams, options?: CreateOptions) {
    const chain = interfaces[this._networkConfig.chain] as VoiInterface
    const currency = params.currency?.id === '0' ? 'voi' : 'arc200'
    const [nftAppId, nftId] = params.asset.id.split('/')

    // Create application
    load(this._appProvider, 'Creating sale app', 'Transaction 1 of 2\n\nPlease check your wallet\nand sign the transaction to create the listing.')
    const transactionConfirmation: TransactionConfirmation = await chain[currency]['arc72']['sale'].create(
      this._walletManager.algodClient,
      this._walletManager.transactionSigner,
      account.address,
      parseInt(nftAppId),
      parseInt(nftId),
      params.price,
      await getContract(`${this._networkConfig.key}:voi_arc72_sale_approval:latest`),
      await getContract(`${this._networkConfig.key}:clear:latest`),
      '5ETIOFVHFK6ENLN4X2S6IC3NJOM7CYYHHTODGEFSIDPUW3TSA4MJ3RYSDQ',
      0
    )

    // Get created app index
    if (transactionConfirmation.txIDs.length === 0) throw new Error('Unexpected error: Application creation failed.')
    const appIndex = await this._networkConfig.services.getCreatedAppId(this._walletManager.algodClient, transactionConfirmation.txIDs[0])
    load(this._appProvider, 'Funding sale app', 'Transaction 2 of 2\n\nPlease check your wallet\nand sign the transaction to create the listing.')

    // Fund created app
    await chain[currency]['arc72']['sale'].fund(
      this._walletManager.algodClient,
      this._walletManager.transactionSigner,
      account.address,
      parseInt(nftAppId),
      parseInt(nftId),
      appIndex
    )

    // Save listing in DB
    return createSale(
      this._client,
      accountId,
      appIndex,
      'Unknown',
      params.asset.id,
      1,
      params.asset.thumbnail,
      'ARC72',
      this._networkConfig.key as VoiPublicNetwork,
      params.currency?.id || '0',
      options?.listingName || params.asset.name || params.asset.id,
      account.address,
      options?.tags?.join(', ') || null,
      params.price
    )
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
