import {SMART_CONTRACT_FEES_ADDRESS, SMART_CONTRACT_FEES_APP_ID} from "@/constants";
import _algosdk from "algosdk";
import {TransactionType} from "algosdk/src/types/transactions";
import {base64ToArrayBuffer, longToByteArray} from "@/utils";
import type {Account, AppCreateObject, PaymentObject, Provider, TransactionParameters} from "@/types";
import {Transaction} from "@/transaction";
import {clearProgram, saleApprovalProgram} from "@/lib/contracts/VoiRwa/VoiRwaContract";
import type {AppCallObject} from "@/types";

export async function VoiRwaSaleBuy (provider: Provider, account: Account, parameters: TransactionParameters) {

    const algosdk = provider.algosdk
    const algodClient = provider.algodClient as _algosdk.Algodv2


    const suggestedParams = await algodClient.getTransactionParams().do()

    const appAddress = algosdk.getApplicationAddress(parameters.appIndex)


    const payObj = {
        type: TransactionType.pay,
        from: account.address,
        to: appAddress,
        amount: parameters.price * 1_000_000,
        suggestedParams
    }

    const appArgs = [new TextEncoder().encode('buy')]
    const appCallObj = {
        type: TransactionType.appl,
        from: account.address,
        appIndex: parameters.appIndex,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: appArgs,
        suggestedParams,
        accounts: [SMART_CONTRACT_FEES_ADDRESS],
        foreignApps:[SMART_CONTRACT_FEES_APP_ID],
    }

    return [payObj, appCallObj]
}
export async function VoiRwaSaleCreate (provider: Provider, account: Account, parameters: TransactionParameters) {
    console.log(parameters)
    const algosdk = provider.algosdk
    const algodClient = provider.algodClient as _algosdk.Algodv2


    const _price = parameters.price * 1_000_000
    const suggestedParams = await algodClient.getTransactionParams().do()
    const appArgs = [
        longToByteArray(_price, 8),
        algosdk.decodeAddress(parameters.feesAddress).publicKey,
        new TextEncoder().encode(parameters.rwaId),
        new TextEncoder().encode(parameters.rwaName),
        algosdk.decodeAddress(parameters.counterPartyAddress).publicKey,
        longToByteArray(parameters.counterPartyFees, 8),
    ]

    const appCreateObj =
        {
            type: TransactionType.appl,
            from: account.address,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            suggestedParams,
            appArgs,
            approvalProgram: base64ToArrayBuffer(saleApprovalProgram),
            clearProgram: base64ToArrayBuffer(clearProgram),
            numGlobalInts: 7,
            numGlobalByteSlices: 7,
            numLocalInts: 0,
            numLocalByteSlices: 0,
        } as AppCreateObject

    const appIndex = Number(await new Transaction([appCreateObj])
        .getFutureAppId(algosdk, algodClient))

    const appAddr = algosdk.getApplicationAddress(appIndex)
    const fundingAmount = 100_000 + 10_000

    const fundAppObj: PaymentObject = {
        type: TransactionType.pay,
        from: account.address,
        to: appAddr,
        amount: fundingAmount,
        suggestedParams,
    }

    const fundAppCallObj: AppCallObject = {
        type: TransactionType.appl,
        appIndex,
        from: account.address,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [new TextEncoder().encode('fund')],
        suggestedParams,
    }

    return [appCreateObj, fundAppObj, fundAppCallObj]
}
