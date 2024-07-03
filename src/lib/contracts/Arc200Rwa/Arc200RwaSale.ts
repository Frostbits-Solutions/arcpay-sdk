import {TRANSACTION_STATE} from "@/constants";
import _algosdk from "algosdk";
import arc200Schema from "@/lib/contracts/abi/arc200";
import {base64ToArrayBuffer, encodeAppArgs, longToByteArray} from "@/utils";
import type {Account, AppCallObject, AppCreateObject, PaymentObject, Provider, TransactionParameters} from "@/types";
import {TransactionType} from "algosdk/src/types/transactions";
import {Transaction} from "@/transaction";
import {clearProgram, saleApprovalProgram} from "@/lib/contracts/Arc200Rwa/Arc200RwaContract";
import {SMART_CONTRACT_FEES_ADDRESS, SMART_CONTRACT_FEES_APP_ID, ARC200_APP_DICT} from "@/constants";

export async function Arc200RwaSaleBuy(provider: Provider, account: Account, parameters: TransactionParameters) {

    console.log(parameters)
    const algosdk = provider.algosdk
    const algodClient = provider.algodClient as _algosdk.Algodv2


    const suggestedParams = await algodClient.getTransactionParams().do()

    const appAddress = algosdk.getApplicationAddress(parameters.appIndex)

    const abi = new algosdk.ABIContract(arc200Schema)
    const abiMethod = abi.getMethodByName('arc200_transfer')
    const args = [appAddress, parameters.price]
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
        foreignApps: [parameters.arc200AppID, parameters.appIndex],
        suggestedParams: suggestedParams,
    }

    const appArgs = [new TextEncoder().encode('buy')]
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

    return [fundArc200Obj, arc200ApproveObj, preValidateObj, appCallObj]
}
export async function Arc200RwaSaleCreate(provider: Provider, account: Account, parameters: TransactionParameters) {
    console.log(parameters)

    const algosdk = provider.algosdk
    const algodClient = provider.algodClient as _algosdk.Algodv2


    /*** Creation of the application ***/
    const _price = parameters.price
    const suggestedParams = await algodClient.getTransactionParams().do()
    const appArgs = [
        longToByteArray(_price, 8),
        new TextEncoder().encode(parameters.rwaId),
        new TextEncoder().encode(parameters.rwaName),
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
    const fundingAmount = 700_000 + 10_000

    const fundAppObj: PaymentObject = {
        type: TransactionType.pay,
        from: account.address,
        to: appAddr,
        amount: fundingAmount,
        suggestedParams,
    }

    const fundAppCallObj: AppCallObject = {
        type: TransactionType.appl,
        appIndex: appIndex,
        from: account.address,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [new TextEncoder().encode('fund')],
        suggestedParams,
    }
    return [appCreateObj, fundAppObj, fundAppCallObj]
}
