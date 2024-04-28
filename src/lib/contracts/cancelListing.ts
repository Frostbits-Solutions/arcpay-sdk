import {TRANSACTION_STATE} from "@/constants";
import _algosdk from "algosdk";
import type {Account, AppDeleteObject, Provider, TransactionParameters} from "@/types";
import {TransactionType} from "algosdk/src/types/transactions";

export async function cancelListing (provider: Provider, account: Account, parameters: TransactionParameters) {

    const algosdk = provider.algosdk
    const algodClient = provider.algodClient as _algosdk.Algodv2


    const suggestedParams = await algodClient.getTransactionParams().do()

    const accounts = [
        parameters.seller,
    ]
    const foreignApps = [parameters.appIndex, parameters.nftAppID]

    const appArgs = [new TextEncoder().encode('cancel')]
    const appCallObj: AppDeleteObject = {
        type: TransactionType.appl,
        from: account.address,
        appIndex: parameters.appIndex,
        onComplete: algosdk.OnApplicationComplete.DeleteApplicationOC,
        accounts,
        appArgs,
        foreignApps,
        suggestedParams
    }

    return [appCallObj]
}
