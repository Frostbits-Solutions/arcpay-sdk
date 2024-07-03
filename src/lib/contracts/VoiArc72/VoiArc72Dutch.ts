import type {Account, AppCallObject, AppCreateObject, PaymentObject, Provider, TransactionParameters} from "@/types";
import {SMART_CONTRACT_FEES_ADDRESS, SMART_CONTRACT_FEES_APP_ID, TRANSACTION_STATE} from "@/constants";
import _algosdk from "algosdk";
import {TransactionType} from "algosdk/src/types/transactions";
import {base64ToArrayBuffer, encodeAppArgs, longToByteArray} from "@/utils";
import {arc72Schema} from "@/lib/contracts/abi/arc72";
import {Transaction} from "@/transaction";
import {clearProgram, dutchApprovalProgram} from "./VoiArc72Contract";

export async function VoiArc72DutchBuy(provider: Provider, account: Account, parameters: TransactionParameters) {

    const algosdk = provider.algosdk
    const algodClient = provider.algodClient as _algosdk.Algodv2


    const suggestedParams = await algodClient.getTransactionParams().do()

    const appAddress = algosdk.getApplicationAddress(parameters.appIndex)

    const preValidateAppArgs = [new TextEncoder().encode('pre_validate')]
    const preValidateObj = {
        type: TransactionType.appl,
        from: account.address,
        appIndex: parameters.appIndex,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: preValidateAppArgs,
        accounts: [
            parameters.seller,
            parameters.feesAddress,
        ],
        foreignApps: [parameters.nftAppID],
        suggestedParams: suggestedParams,
    }

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

    return [preValidateObj, payObj, appCallObj]
}
export async function VoiArc72DutchCreate (provider: Provider, account: Account, parameters: TransactionParameters) {

    const algosdk = provider.algosdk
    const algodClient = provider.algodClient as _algosdk.Algodv2

console.log(parameters)
    /*** Creation of the application ***/
    const _priceMin = parameters.priceMin * 1_000_000
    const _priceMax = parameters.priceMax * 1_000_000
    const suggestedParams = await algodClient.getTransactionParams().do()
    const appArgs = [
        longToByteArray(parameters.nftAppID, 8),
        longToByteArray(parameters.nftID, 32),
        longToByteArray(_priceMax, 8),
        longToByteArray(_priceMin, 8),
        longToByteArray((Date.now() + parameters.duration * 3_600_000) / 1_000, 8),
    ]

    const appCreateObj =
        {
            type: TransactionType.appl,
            from: account.address,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            suggestedParams,
            appArgs,
            approvalProgram: base64ToArrayBuffer(dutchApprovalProgram),
            clearProgram: base64ToArrayBuffer(clearProgram),
            numGlobalInts: 8,
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

    const abi = new algosdk.ABIContract(arc72Schema)
    const abiMethod = abi.getMethodByName('arc72_approve')
    const args = [appAddr, parameters.nftID]
    const appArgsFund = encodeAppArgs(abiMethod, args)

    const appCallObj: AppCallObject = {
        type: TransactionType.appl,
        suggestedParams: suggestedParams,
        from: account.address,
        appIndex: parameters.nftAppID,
        appArgs: appArgsFund,
        foreignApps: [parameters.nftAppID],
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
    }

    const fundAppCallObj: AppCallObject = {
        type: TransactionType.appl,
        appIndex: appIndex,
        from: account.address,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [new TextEncoder().encode('fund')],
        suggestedParams,
    }

    return [appCreateObj, fundAppObj, appCallObj, fundAppCallObj]
}
