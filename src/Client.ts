import { createSupabaseClient } from '@/lib/supabase/supabaseClient'
import type { SupabaseClient } from '@supabase/supabase-js'
import { useModalsStore } from '@/stores/modalsStore'
import { useParametersStore } from '@/stores/parametersStore'
import { useWalletStore } from '@/stores/walletStore'
import { useTransactionStore } from '@/stores/transactionStore'
import { CONTRACT_TYPE, CONVENTION_TYPE, TRANSACTION_TYPE } from '@/constants'
import { routerListenStores } from '@/router'
import {getListingById, getListings} from '@/lib/supabase/listings'

interface ArcpayClientOptions {
  apiKey?: string,
  client?: SupabaseClient,
}

export class Client {
  private readonly _client: SupabaseClient
  private readonly _apiKey: string | undefined

  constructor(options: ArcpayClientOptions) {
    if (options.client) {
      this._client = options.client
    } else {
      if (!options.apiKey) throw new Error('API key is required')
      this._client = createSupabaseClient(options.apiKey)
      this._apiKey = options.apiKey
    }
  }

  private async _deriveAccountIdFromKey() {
    if (this._apiKey) {
      return this._client.rpc('get_key_account_id', {
        key: this._apiKey,
        origin: window.location.origin
      })
    }
    return { data: null, error: 'Missing API Key' }
  }

  public async createListing(account_id?: number) {
    const modals = useModalsStore()
    modals.showModal('root')

    const params = useParametersStore()

    if (typeof account_id === 'undefined') {
      const { data, error } = await this._deriveAccountIdFromKey()
      if (error) {
        console.error(error)
        return
      }
      account_id = data
    }

    if(typeof account_id !== 'undefined') {
      params.account_id = account_id
    }

    const walletStore = useWalletStore()
    const transactionStore = useTransactionStore()
    // @ts-ignore
    transactionStore.walletStore = walletStore
    // @ts-ignore
    transactionStore.parameterStore = params
    transactionStore.transactionType = TRANSACTION_TYPE.create
    transactionStore.contractType = CONTRACT_TYPE.Sale
    transactionStore.conventionType = CONVENTION_TYPE.VoiArc72
    transactionStore.client = this._client

    routerListenStores()
  }

  public async getListings() {
    return await getListings(this._client)
  }

  public async getListingById(listing_id: string) {
    return await getListingById(this._client, listing_id)
  }

  public async updateListing() {
    const modals = useModalsStore()
    modals.showModal('root')
    const params = useParametersStore()

    const walletStore = useWalletStore()
    const transactionStore = useTransactionStore()
    // @ts-ignore
    transactionStore.walletStore = walletStore
    // @ts-ignore
    transactionStore.parameterStore = params
    transactionStore.transactionType = TRANSACTION_TYPE.update
    routerListenStores()
  }

  public async cancelListing() {
    const modals = useModalsStore()
    modals.showModal('root')
    const params = useParametersStore()

    const walletStore = useWalletStore()
    const transactionStore = useTransactionStore()
    // @ts-ignore
    transactionStore.walletStore = walletStore
    // @ts-ignore
    transactionStore.parameterStore = params
    transactionStore.transactionType = TRANSACTION_TYPE.cancel
    routerListenStores()
  }

  public async closeListing() {
    const modals = useModalsStore()
    modals.showModal('root')
    const params = useParametersStore()

    const walletStore = useWalletStore()
    const transactionStore = useTransactionStore()
    // @ts-ignore
    transactionStore.walletStore = walletStore
    // @ts-ignore
    transactionStore.parameterStore = params
    transactionStore.transactionType = TRANSACTION_TYPE.close
    transactionStore.contractType = CONTRACT_TYPE.Auction
    routerListenStores()
  }

  public async buy (listing_id: string) {
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

    await params.getListingParameters(this._client, listing_id)
    if (params.listingType === 'sale') {
      if (params.assetType === 'ARC72') {
        if (params.arc200AppID) {
          transactionStore.conventionType = CONVENTION_TYPE.Arc200Arc72
        } else {
          transactionStore.conventionType = CONVENTION_TYPE.VoiArc72
        }
      } else {
        if (params.arc200AppID) {
          transactionStore.conventionType = CONVENTION_TYPE.Arc200Rwa
        } else {
          transactionStore.conventionType = CONVENTION_TYPE.VoiRwa
        }
      }
      routerListenStores()
    } else {
      console.error(`Listing ${listing_id} is not a sale`)
    }
  }

  public async bid (listing_id: string) {
    const modals = useModalsStore()
    modals.showModal('root')
    const params = useParametersStore()

    const walletStore = useWalletStore()
    const transactionStore = useTransactionStore()
    // @ts-ignore
    transactionStore.walletStore = walletStore
    // @ts-ignore
    transactionStore.parameterStore = params

    await params.getListingParameters(this._client, listing_id)
    if (params.listingType === 'auction') {
      if (params.auctionType === 'dutch') {
        transactionStore.transactionType = TRANSACTION_TYPE.buy
        transactionStore.contractType = CONTRACT_TYPE.Dutch
      } else {
        transactionStore.transactionType = TRANSACTION_TYPE.bid
        transactionStore.contractType = CONTRACT_TYPE.Auction
      }

      if (params.assetType === 'ARC72') {
        if (params.arc200AppID) {
          transactionStore.conventionType = CONVENTION_TYPE.Arc200Arc72
        } else {
          transactionStore.conventionType = CONVENTION_TYPE.VoiArc72
        }
      } else {
        if (params.arc200AppID) {
          transactionStore.conventionType = CONVENTION_TYPE.Arc200Rwa
        } else {
          transactionStore.conventionType = CONVENTION_TYPE.VoiRwa
        }
      }
      routerListenStores()
    } else {
      console.error(`Listing ${listing_id} is not an auction`)
    }
  }
}
