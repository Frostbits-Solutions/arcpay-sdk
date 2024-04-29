import _algosdk from "algosdk";
import type {Account, AppCallObject, AppDeleteObject, Provider, TransactionParameters} from "@/types";
import {TransactionType} from "algosdk/src/types/transactions";

export async function closeListing (provider: Provider, account: Account, parameters: TransactionParameters) {
    console.log(parameters)
    const algosdk = provider.algosdk
    const algodClient = provider.algodClient as _algosdk.Algodv2


    const suggestedParams = await algodClient.getTransactionParams().do()

    const accounts = [
        account.address,
    ]
    const foreignApps = [parameters.appIndex]

    const obj: Array<AppCallObject> = []

    if (parameters.arc200AppID) {
        const preValidateAppCallObj: AppCallObject = {
            type: TransactionType.appl,
            from: account.address,
            appIndex: parameters.appIndex,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: [new TextEncoder().encode('pre_validate')],
            suggestedParams
        }
        obj.push(preValidateAppCallObj)
    }

    const appArgs = [new TextEncoder().encode('close')]
    const appCallObj: AppCallObject = {
        type: TransactionType.appl,
        from: account.address,
        appIndex: parameters.appIndex,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        accounts,
        appArgs,
        foreignApps,
        suggestedParams
    }

    return [...obj, appCallObj]
}
