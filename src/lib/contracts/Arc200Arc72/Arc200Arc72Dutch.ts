import type {Account, AppCallObject, AppCreateObject, PaymentObject, Provider, TransactionParameters} from "@/types";
import _algosdk from "algosdk";
import arc200Schema from "@/lib/contracts/abi/arc200";
import {base64ToArrayBuffer, encodeAppArgs, longToByteArray} from "@/utils";
import {TransactionType} from "algosdk/src/types/transactions";
import {arc72Schema} from "@/lib/contracts/abi/arc72";
import {dutchApprovalProgram, clearProgram} from "./Arc200Arc72Contract";
import {Transaction} from "@/transaction";
import {SMART_CONTRACT_FEES_ADDRESS, SMART_CONTRACT_FEES_APP_ID, ARC200_APP_DICT} from "@/constants";

export async function Arc200Arc72DutchBuy(provider: Provider, account: Account, parameters: TransactionParameters) {
    console.log(parameters)
    const algosdk = provider.algosdk
    const algodClient = provider.algodClient as _algosdk.Algodv2

    const suggestedParams = await algodClient.getTransactionParams().do()

    const abi = new algosdk.ABIContract(arc200Schema)
    const abiMethod = abi.getMethodByName('arc200_transfer')
    const args = [parameters.appAddress, parameters.price]
    const arc200AppArgs = encodeAppArgs(abiMethod, args)

    const fundArc200Obj: PaymentObject = {
        type: TransactionType.pay,
        from: account.address,
        to: parameters.arc200AppAddress,
        amount: 28500,
        suggestedParams
    }

    const arc200ApproveObj: AppCallObject = {
        type: TransactionType.appl,
        suggestedParams: suggestedParams,
        from: account.address,
        appIndex: parameters.arc200AppID,
        appArgs: arc200AppArgs,
        foreignApps: [parameters.arc200AppID],
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
    }

    const preValidateAppArgs = [new TextEncoder().encode('pre_validate')]
    const preValidateObj: AppCallObject = {
        type: TransactionType.appl,
        from: account.address,
        appIndex: parameters.appIndex,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: preValidateAppArgs,
        accounts: [
            parameters.seller,
            parameters.feesAddress,
        ],
        foreignApps: [parameters.nftAppID, parameters.arc200AppID, parameters.appIndex],
        suggestedParams: suggestedParams,
    }

    const preValidateAppArgs2 = [new TextEncoder().encode('pre_validate')]
    const preValidateObj2: AppCallObject = {
        type: TransactionType.appl,
        from: account.address,
        appIndex: parameters.appIndex,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: preValidateAppArgs2,
        suggestedParams: suggestedParams,
    }

    const appArgs = [
        new TextEncoder().encode('buy'),
        longToByteArray(parameters.price, 8),
    ]
    const appCallObj: AppCallObject = {
        type: TransactionType.appl,
        from: account.address,
        appIndex: parameters.appIndex,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: appArgs,
        suggestedParams,
        accounts: [SMART_CONTRACT_FEES_ADDRESS],
        foreignApps:[SMART_CONTRACT_FEES_APP_ID, ARC200_APP_DICT[parameters.arc200AppID]],
    }

    return [fundArc200Obj, arc200ApproveObj, preValidateObj, preValidateObj2, appCallObj]
}
export async function Arc200Arc72DutchCreate(provider: Provider, account: Account, parameters: TransactionParameters) {
    const algosdk = provider.algosdk
    const algodClient = provider.algodClient as _algosdk.Algodv2

    const _priceMin = parameters.priceMin
    const _priceMax = parameters.priceMax
    const suggestedParams = await algodClient.getTransactionParams().do()
    const appArgs = [
        longToByteArray(parameters.nftAppID, 8),
        longToByteArray(parameters.nftID, 32),
        longToByteArray(_priceMax, 8),
        longToByteArray(_priceMin, 8),
        longToByteArray((Date.now() + parameters.duration * 3_600_000) / 1_000, 8),
        longToByteArray(parameters.arc200AppID, 8),
        algosdk.decodeAddress(parameters.arc200AppAddress).publicKey,
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
            approvalProgram: base64ToArrayBuffer(dutchApprovalProgram),
            clearProgram: base64ToArrayBuffer(clearProgram),
            numGlobalInts: 9,
            numGlobalByteSlices: 9,
            numLocalInts: 0,
            numLocalByteSlices: 0,
        } as AppCreateObject

    const appIndex = Number(await new Transaction([appCreateObj])
        .getFutureAppId(algosdk, algodClient))



    const appAddr = algosdk.getApplicationAddress(appIndex)
    const fundingAmount = 300_000

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
        suggestedParams,
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
