import {type WalletAccount, WalletManager} from "@txnlab/use-wallet";
import {AppProvider, load} from "@/lib/app";
import {interfaces} from "@/lib/contracts/interfaces";
import type {TransactionConfirmation} from "@/lib/transaction/Transaction";
import type {Database} from "@/lib/supabase/database.types";

type ListingParams = Database['public']['Functions']['get_listing_by_id']['Returns']

export async function cancel(appProvider: AppProvider, walletManager: WalletManager, account: WalletAccount, params: ListingParams): Promise<TransactionConfirmation> {
    const args: number[] = []
    if (params.asset_type === 'asa' && params.asset_id) args.push(parseInt(params.asset_id))
    if (params.currency_type === 'asa' && params.currency) args.push(parseInt(params.currency))
    if (!params.app_id) throw new Error('Unexpected error: App ID is required to close listing.')

    load(appProvider, 'Awaiting transaction confirmation', 'Please check your wallet and sign the transaction.')
    const transactionConfirmation: TransactionConfirmation = await interfaces["common"].cancel(
        walletManager.algodClient,
        walletManager.transactionSigner,
        account.address,
        params.app_id,
        ...args
    )
    if (transactionConfirmation.txIDs.length === 0) throw new Error('Unexpected error: Closing listing failed.')
    return transactionConfirmation
}