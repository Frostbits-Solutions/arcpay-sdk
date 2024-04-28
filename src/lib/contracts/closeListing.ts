import _algosdk from "algosdk";
import type {Account, AppDeleteObject, Provider, TransactionParameters} from "@/types";
import {TransactionType} from "algosdk/src/types/transactions";

export async function closeListing (provider: Provider, account: Account, parameters: TransactionParameters) {

    const algosdk = provider.algosdk
    const algodClient = provider.algodClient as _algosdk.Algodv2


    const suggestedParams = await algodClient.getTransactionParams().do()

    const accounts = [
        account.address,
    ]
    const foreignApps = [parameters.appIndex]

    const appArgs = [new TextEncoder().encode('close')]
    const appCallObj: AppDeleteObject = {
        type: TransactionType.appl,
        from: account.address,
        appIndex: parameters.appIndex,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        accounts,
        appArgs,
        foreignApps,
        suggestedParams
    }

    return [appCallObj]
}
