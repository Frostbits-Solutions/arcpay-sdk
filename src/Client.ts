import {createSupabaseClient, deriveAccountIdFromKey} from '@/lib/supabase/supabaseClient'
import type {SupabaseClient} from '@supabase/supabase-js'
import type {NetworksConfig, PublicNetwork} from '@/lib/algod/networks.config'
import {networksConfig} from '@/lib/algod/networks.config'
import type {App} from 'vue'
import {
    AppProvider,
    closeDialog,
    createListing,
    type CreateListingOptions,
    displayError,
    type ListingCreationParams,
    selectWallet,
    success
} from '@/lib/app'
import {type SupportedWallet, type WalletAccount, WalletManager} from '@txnlab/use-wallet'
import {createAuction, createDutchAuction, createSale, getListingById, getListings} from '@/lib/supabase/listings'
import type {ListingType} from '@/lib/app/createListing'
import type {TransactionConfirmation} from '@/lib/transaction/Transaction'
import {reviewListing} from '@/lib/app/reviewListing'
import {createApp} from "@/lib/contracts/createApp";
import {buy} from "@/lib/contracts/buy";
import {close} from "@/lib/contracts/close";
import {cancel} from "@/lib/contracts/cancel";

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

        if (!accountId) {
            const {data, error} = await deriveAccountIdFromKey(this._client, this._apiKey as string)
            if (data === null || error) throw new Error(`Unable to derive account ID from key. This is likely because of an invalid API Key. Make sure the key allowed origin is ${window.location.origin}. You can create new API keys from the arcpay dashboard`)
            accountId = data
        }

        if (!accountId) throw new Error('Unexpected error: Account ID is undefined')
        try {
            const account: WalletAccount = await selectWallet(this._appProvider)
            const params: ListingCreationParams = await createListing(this._appProvider, account, options satisfies CreateListingOptions | undefined)
            // Create application
            const appIndex = await createApp(this._networkConfig, this._appProvider, this._walletManager, this._client, account, params)
            // Save listing in DB
            let listingId: string | undefined
            if (params.type === 'sale') {
                const {data, error} = await createSale(
                    this._client,
                    accountId,
                    appIndex,
                    null,
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
            } else if (params.type === 'auction') {
                const {data, error} = await createAuction(
                    this._client,
                    accountId,
                    appIndex,
                    null,
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
                    1,
                )
                if (error) throw new Error(`Error creating auction: ${error.message}`)
                listingId = data?.[0]?.listing_id
            } else if (params.type === 'dutch') {
                const {data, error} = await createDutchAuction(
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
                    params.priceMin,
                    params.priceMax
                )
                if (error) throw new Error(`Error creating dutch auction: ${error.message}`)
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

    public async buy(id: string): Promise<TransactionConfirmation | undefined> {
        try {
            const {data: listingParams, error} = await getListingById(this._client, id)
            if (error) throw new Error(`Unable to fetch listing: ${error.message}`)

            if (listingParams && listingParams.asset_id) {
                const price = await reviewListing(this._appProvider, listingParams)
                const account: WalletAccount = await selectWallet(this._appProvider)
                const transactionConfirmation = await buy(this._networkConfig, this._appProvider, this._walletManager, account, listingParams, price)
                success(this._appProvider, 'Success!', 'Transaction confirmed, check your wallet!', () => {
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

    public async close(id: string): Promise<TransactionConfirmation | undefined> {
        try {
            const {data: listingParams, error} = await getListingById(this._client, id)
            if (error) throw new Error(`Unable to fetch listing: ${error.message}`)

            if (listingParams && listingParams.asset_id) {
                const account: WalletAccount = await selectWallet(this._appProvider)
                const transactionConfirmation = await close(this._networkConfig, this._appProvider, this._walletManager, account, listingParams)
                success(this._appProvider, 'Success!', 'Listing has been closed', () => {
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

    public async cancel(id: string): Promise<TransactionConfirmation | undefined> {
        try {
            const {data: listingParams, error} = await getListingById(this._client, id)
            if (error) throw new Error(`Unable to fetch listing: ${error.message}`)

            if (listingParams && listingParams.asset_id) {
                const account: WalletAccount = await selectWallet(this._appProvider)
                const transactionConfirmation = await cancel(this._appProvider, this._walletManager, account, listingParams)
                success(this._appProvider, 'Success!', 'Listing has been cancelled', () => {
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
