import {type WalletAccount, WalletManager} from "@txnlab/use-wallet";
import {AppProvider, load} from "@/lib/app";
import {interfaces} from "@/lib/contracts/interfaces";
import type {TransactionConfirmation} from "@/lib/transaction/Transaction";
import type {NetworksConfig} from "@/lib/algod/networks.config";
import type {Database} from "@/lib/supabase/database.types";
import {getCurrency} from "@/lib/supabase/currencies";
import type {SupabaseClient} from "@supabase/supabase-js";
import algosdk from "algosdk";

type ListingParams = Database['public']['Functions']['get_listing_by_id']['Returns']
type Currency = Database['public']['Tables']['currencies']['Row']

export async function buy(networkConfig: NetworksConfig, appProvider: AppProvider, walletManager: WalletManager, client: SupabaseClient, account: WalletAccount, params: ListingParams, price: number): Promise<TransactionConfirmation> {
    const chainInterface = interfaces[networkConfig.chain]

    const {data, error} = await getCurrency(client, networkConfig.key, params.listing_currency || '0')
    if (!data || !data.length || error) throw new Error(`Unexpected error: Invalid listing currency ${params.listing_currency}.`)
    const currency = data[0]

    load(appProvider, 'Awaiting transaction confirmation', 'Please check your wallet and sign the transaction.')
    // Buy
    if (params.listing_type === 'sale' || (params.listing_type === 'auction' && params.auction_type === 'dutch')) {
        const type = params.listing_type === 'sale' ? 'sale' : 'dutch'
        //@ts-ignore
        const transactionConfirmation: TransactionConfirmation = await chainInterface[currency.type][params.asset_type][type].buy(
            walletManager.algodClient,
            walletManager.transactionSigner,
            account.address,
            ...formatCurrency(currency),
            ...formatNftID(params),
            params.app_id,
            params.seller_address,
            price,
            'ZTVMV2EQNUU3HJQ3HUPBLXMPD3PLVQGCJ4SDGOM4BU2W4554UTMPDQ2TTU',
            54881294,
        )
        if (transactionConfirmation.txIDs.length === 0) throw new Error('Unexpected error: Buying listing failed.')
        return transactionConfirmation
    }

    // Bid
    if (params.listing_type === 'auction' && params.auction_type === 'english') {
        //@ts-ignore
        const transactionConfirmation: TransactionConfirmation = await chainInterface[currency.type][params.asset_type]['auction'].bid(
            walletManager.algodClient,
            walletManager.transactionSigner,
            account.address,
            ...formatCurrency(currency),
            params.app_id,
            price
        )
        if (transactionConfirmation.txIDs.length === 0) throw new Error('Unexpected error: Bidding on listing failed.')
        return transactionConfirmation
    }

    throw new Error(`Unexpected error: Invalid listing type ${params.listing_type}`)
}

function formatCurrency(currency: Currency): (number | string)[] {
    const args = []
    try {
        if (currency.type === 'asa') {
            args.push(parseInt(currency.id))
            args.push(currency.decimals || 1_000_000)
        }
        if (currency.type === 'arc200') {
            if (!currency.fees_address) throw new Error(`Arc200 fees address is null`)
            args.push(parseInt(currency.id))
            args.push(algosdk.getApplicationAddress(parseInt(currency.id)))
            args.push(currency.fees_address)
        }
    } catch (e) {
        throw new Error(`Error while formatting currency args: ${e}`)
    }
    return args

}

function formatNftID(params: ListingParams): (number | string)[] {
    const args = []
    if (!params.asset_id) throw new Error(`asset_id is null`)
    try {
        if (params.asset_type === 'arc72') {
            const [nftAppId, _] = params.asset_id.split('/')
            args.push(parseInt(nftAppId))
        } else if (params.asset_type !== 'offchain') args.push(params.asset_id)
    } catch (e) {
        throw new Error(`Invalid asset id ${params.asset_id}. ${e}`)
    }
    return args
}
