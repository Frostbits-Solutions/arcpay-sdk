import {type WalletAccount, WalletManager} from "@txnlab/use-wallet";
import {AppProvider, type BuyParams, load} from "@/lib/app";
import {interfaces} from "@/lib/contracts/interfaces";
import type {TransactionConfirmation} from "@/lib/transaction/Transaction";
import type {NetworksConfig} from "@/lib/algod/networks.config";
import type {SupabaseClient} from "@supabase/supabase-js";

export async function buy(networkConfig: NetworksConfig, appProvider: AppProvider, walletManager: WalletManager, client: SupabaseClient, accountId: number, account: WalletAccount, params: BuyParams): Promise<void> {
    const chainInterface = interfaces[networkConfig.chain]
    const currency = params.currency?.type || networkConfig.chain


    // Create application
    load(appProvider, 'Calling app', 'Transaction 1 of 1\n\nPlease check your wallet\nand sign the transaction to buy the listing.')
    const transactionConfirmation: TransactionConfirmation = await chainInterface[currency][params.asset.type][params.type].buy(
        walletManager.algodClient,
        walletManager.transactionSigner,
        account.address,
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

function formatNftID(networkConfig: NetworksConfig, params: BuyParams): number[] {
    const args = []
    try {
        if (networkConfig.chain === 'voi') {
            const [nftAppId, nftId] = params.nftID.split('/')
            args.push(parseInt(nftAppId), parseInt(nftId))
        } else {
            args.push(parseInt(params.nftID))
        }
    } catch (e) {
        throw new Error(`Invalid asset id ${params.nftID}. ${e}`)
    }
    return args
}
