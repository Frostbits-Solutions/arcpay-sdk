import {type WalletAccount, WalletManager} from "@txnlab/use-wallet";
import {AppProvider, type ListingCreationParams, load} from "@/lib/app";
import {interfaces, type VoiInterface} from "@/lib/contracts/interfaces";
import type {TransactionConfirmation} from "@/lib/transaction/Transaction";
import getContract from "@/lib/contracts/contracts";
import type {NetworksConfig} from "@/lib/algod/networks.config";
import type {SupabaseClient} from "@supabase/supabase-js";

export async function createApp(networkConfig: NetworksConfig, appProvider: AppProvider, walletManager: WalletManager, client: SupabaseClient, accountId: number, account: WalletAccount, params: ListingCreationParams): Promise<number> {
    const chainInterface = interfaces[networkConfig.chain] as VoiInterface
    const currency = params.currency?.type || networkConfig.chain

    const args = []
    if (params.type === 'sale') args.push(...formatSaleArgs(params))
    if (params.type === 'auction') args.push(...formatAuctionArgs(params))
    if (params.type === 'dutch') args.push(...formatDutchArgs(params))

    // Create application
    load(appProvider, 'Creating app', 'Transaction 1 of 2\n\nPlease check your wallet\nand sign the transaction to create the listing.')
    const transactionConfirmation: TransactionConfirmation = await chainInterface[currency][params.asset.type][params.type].create(
        walletManager.algodClient,
        walletManager.transactionSigner,
        account.address,
        ...formatNftID(networkConfig, params),
        ...args,
        await getContract(`${networkConfig.key}:${currency}_${params.asset.type.toLowerCase()}_${params.type}_approval:latest`),
        await getContract(`${networkConfig.key}:clear:latest`),
        '5ETIOFVHFK6ENLN4X2S6IC3NJOM7CYYHHTODGEFSIDPUW3TSA4MJ3RYSDQ',
        0
    )

    // Get created app index
    if (transactionConfirmation.txIDs.length === 0) throw new Error('Unexpected error: Application creation failed.')
    const appIndex = await networkConfig.services.getCreatedAppId(walletManager.algodClient, transactionConfirmation.txIDs[0])
    load(appProvider, 'Funding app', 'Transaction 2 of 2\n\nPlease check your wallet\nand sign the transaction to create the listing.')

    // Fund created app
    await chainInterface[currency][params.asset.type][params.type].fund(
        walletManager.algodClient,
        walletManager.transactionSigner,
        account.address,
        ...formatNftID(networkConfig, params),
        appIndex
    )

    return appIndex
}

function formatNftID(networkConfig: NetworksConfig, params: ListingCreationParams): number[] {
    const args = []
    try {
        if (networkConfig.chain === 'voi') {
            const [nftAppId, nftId] = params.asset.id.split('/')
            args.push(parseInt(nftAppId), parseInt(nftId))
        } else {
            args.push(parseInt(params.asset.id))
        }
    } catch (e) {
        throw new Error(`Invalid asset id ${params.asset.id}. ${e}`)
    }
    return args
}

function formatSaleArgs(params: ListingCreationParams): number[] {
    if (!('price' in params)) throw new Error(`Missing parameter price for creating a voi sale`)
    return [params.price]
}

function formatAuctionArgs(params: ListingCreationParams): number[] {
    if (!('price' in params)) throw new Error(`Missing parameter price for creating a voi auction`)
    if (!('duration' in params)) throw new Error(`Missing parameter duration for creating a voi auction`)
    return [params.price, params.duration]
}

function formatDutchArgs(params: ListingCreationParams): number[] {
    if (!('priceMin' in params)) throw new Error(`Missing parameter priceMin for creating a voi dutch`)
    if (!('priceMax' in params)) throw new Error(`Missing parameter priceMax for creating a voi dutch`)
    if (!('duration' in params)) throw new Error(`Missing parameter duration for creating a voi dutch`)
    return [params.priceMin, params.priceMax, params.duration]
}
