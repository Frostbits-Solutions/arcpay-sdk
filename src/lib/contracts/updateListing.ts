import {TRANSACTION_STATE} from "@/constants";
import _algosdk from "algosdk";
import {longToByteArray} from "@/utils";
import type {Account, AppCallObject, Provider, TransactionParameters} from "@/types";
import {TransactionType} from "algosdk/src/types/transactions";

export async function updateListing (provider: Provider, account: Account, parameters: TransactionParameters) {

    const algosdk = provider.algosdk
    const algodClient = provider.algodClient as _algosdk.Algodv2

    const suggestedParams = await algodClient.getTransactionParams().do()

    const _price = parameters.arc200AppID ? parameters.price : parameters.price * 1_000_000
    const appArgs = [
        new TextEncoder().encode('update_price'),
        longToByteArray(_price, 8)]
    const accounts = [parameters.feesAddress]

    const appCallObj: AppCallObject = {
        type: TransactionType.appl,
        appIndex: parameters.appIndex,
        from: account.address,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs,
        accounts,
        suggestedParams
    }
    return [appCallObj]
}
