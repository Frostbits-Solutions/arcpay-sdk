import {type WalletAccount, WalletManager} from "@txnlab/use-wallet";
import {AppProvider, type ListingCreationParams, load} from "@/lib/app";
import {interfaces, type CurrencyInterface, type AssetInterface} from "@/lib/contracts/interfaces";
import type {TransactionConfirmation} from "@/lib/transaction/Transaction";
import getContract from "@/lib/supabase/contracts";
import type {NetworksConfig} from "@/lib/algod/networks.config";
import type {SupabaseClient} from "@supabase/supabase-js";
import algosdk from "algosdk";
import {formatAmountToDecimals} from "@/lib/utils";

export async function createApp(networkConfig: NetworksConfig, appProvider: AppProvider, walletManager: WalletManager, client: SupabaseClient, account: WalletAccount, params: ListingCreationParams): Promise<number> {
    const chain = networkConfig.chain
    const currency = params.currency?.type
    if (!currency) throw new Error(`Unexpected error: Invalid currency ${params.currency?.name}`)
    const chainInterface = interfaces[chain]
    // @ts-expect-error
    const currencyInterface = chainInterface[currency] as CurrencyInterface
    // @ts-expect-error
    const assetInterface = currencyInterface[params.asset.type] as AssetInterface

    const args = []
    if (params.type === 'sale') args.push(...formatSaleArgs(params))
    if (params.type === 'auction') args.push(...formatAuctionArgs(params))
    if (params.type === 'dutch') args.push(...formatDutchArgs(params))

    // Create application
    load(appProvider, 'Creating app', 'Transaction 1 of 2\n\nPlease check your wallet\nand sign the transaction to create the listing.')
    const transactionConfirmation: TransactionConfirmation = await assetInterface[params.type].create(
        walletManager.algodClient,
        walletManager.transactionSigner,
        await getContract(client, networkConfig.key, `${currency}_${params.asset.type}_${params.type}_approval`),
        "CoEBQw==",
        account.address,
        '5ETIOFVHFK6ENLN4X2S6IC3NJOM7CYYHHTODGEFSIDPUW3TSA4MJ3RYSDQ',
        0,
        ...formatCurrency(params),
        ...formatNftID(networkConfig, params),
        ...args
    )

    // Get created app index
    if (transactionConfirmation.txIDs.length === 0) throw new Error('Unexpected error: Application creation failed.')
    const appIndex = await networkConfig.services.getCreatedAppId(walletManager.algodClient, transactionConfirmation.txIDs[0])
    load(appProvider, 'Funding app', 'Transaction 2 of 2\n\nPlease check your wallet\nand sign the transaction to create the listing.')

    // Fund created app
    await assetInterface[params.type].fund(
        walletManager.algodClient,
        walletManager.transactionSigner,
        account.address,
        appIndex,
        ...formatCurrency(params),
        ...formatNftID(networkConfig, params)
    )
    return appIndex
}

function formatCurrency(params: ListingCreationParams) {
    const args = []
    try {
        if (params.currency?.type === 'asa') {
            args.push(parseInt(params.currency.id))
        }
        if (params.currency?.type === 'arc200') {
            args.push(parseInt(params.currency.id))
            args.push(algosdk.getApplicationAddress(parseInt(params.currency.id)))
        }
    } catch (e) {
        throw new Error(`Invalid currency id ${params.currency?.id}. ${e}`)
    }
    return args
}

function formatNftID(networkConfig: NetworksConfig, params: ListingCreationParams): (number | string)[] {
    const args = []
    try {
        if (params.asset.type === 'offchain') {
            args.push(params.asset.id)
            args.push(params.asset.name)
        } else {
            if (networkConfig.chain === 'voi') {
                const [nftAppId, nftId] = params.asset.id.split('/')
                args.push(parseInt(nftAppId), parseInt(nftId))
            } else {
                args.push(parseInt(params.asset.id))
            }
        }
    } catch (e) {
        throw new Error(`Invalid asset id ${params.asset.id}. ${e}`)
    }
    return args
}

function formatSaleArgs(params: ListingCreationParams): number[] {
    if (!('price' in params)) throw new Error(`Missing parameter price for creating a sale`)
    if (params.currency?.decimals === null) throw new Error(`Unexpected error: Currency decimals is null`)
    return [formatAmountToDecimals(params.price, params.currency?.decimals)]
}

function formatAuctionArgs(params: ListingCreationParams): number[] {
    if (!('price' in params)) throw new Error(`Missing parameter price for creating an auction`)
    if (!('duration' in params)) throw new Error(`Missing parameter duration for creating an auction`)
    if (params.currency?.decimals === null) throw new Error(`Unexpected error: Currency decimals is null`)
    return [formatAmountToDecimals(params.price, params.currency?.decimals), params.duration]
}

function formatDutchArgs(params: ListingCreationParams): number[] {
    if (!('priceMin' in params)) throw new Error(`Missing parameter priceMin for creating a dutch auction`)
    if (!('priceMax' in params)) throw new Error(`Missing parameter priceMax for creating a dutch auction`)
    if (!('duration' in params)) throw new Error(`Missing parameter duration for creating a dutch auction`)
    if (params.currency?.decimals === null) throw new Error(`Unexpected error: Currency decimals is null`)
    return [
        formatAmountToDecimals(params.priceMin, params.currency?.decimals),
        formatAmountToDecimals(params.priceMax, params.currency?.decimals),
        params.duration
    ]
}
