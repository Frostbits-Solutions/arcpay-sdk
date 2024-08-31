import {type WalletAccount, WalletManager} from "@txnlab/use-wallet";
import {AppProvider, load} from "@/lib/app";
import {interfaces} from "@/lib/contracts/interfaces";
import type {TransactionConfirmation} from "@/lib/transaction/Transaction";
import type {NetworksConfig} from "@/lib/algod/networks.config";
import type {SupabaseClient} from "@supabase/supabase-js";

export async function buy(networkConfig: NetworksConfig, appProvider: AppProvider, walletManager: WalletManager, client: SupabaseClient, accountId: number, account: WalletAccount, params): Promise<void> {
    const chainInterface = interfaces[networkConfig.chain]
    const currency = params.currency?.type || networkConfig.chain


    // Create application
    load(appProvider, 'Calling app', 'Transaction 1 of 1\n\nPlease check your wallet\nand sign the transaction to buy the listing.')
    const transactionConfirmation: TransactionConfirmation = await chainInterface[currency][params.asset.type][params.type].buy(
        walletManager.algodClient,
        walletManager.transactionSigner,
        account.address,
        ...formatCurrency(networkConfig, params),
        ...formatNftID(networkConfig, params),
        params.nftID,
        params.appIndex,
        params.sellerAddress,
        params.price,
        params.feesAppAddress,
        params.feesAppId
    )

    // Get created app index
    if (transactionConfirmation.txIDs.length === 0) throw new Error('Unexpected error: Buying listing failed.')
}


function formatCurrency(networkConfig: NetworksConfig, params) {
    const args = []
    try {
        if ( params.currency?.type === 'ASA') {
            if (networkConfig.chain === 'voi') {
                const [nftAppId, nftId] = params.currency.id.split('/')
                args.push(parseInt(nftAppId), parseInt(nftId))
            } else {
                args.push(parseInt(params.currency.id))
            }
            args.push(params.currency?.decimals)
        }
    } catch (e) {
        throw new Error(`Invalid asset id ${params.asset.id}. ${e}`)
    }
    return args

}

function formatNftID(networkConfig: NetworksConfig, params): number[] {
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
