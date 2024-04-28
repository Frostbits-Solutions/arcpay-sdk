import type {Account, AppCallObject, AppCreateObject, PaymentObject, Provider, TransactionParameters} from "@/types";
import _algosdk from "algosdk";
import arc200Schema from "@/lib/contracts/abi/arc200";
import {base64ToArrayBuffer, encodeAppArgs, longToByteArray} from "@/utils";
import {TransactionType} from "algosdk/src/types/transactions";
import {arc72Schema} from "@/lib/contracts/abi/arc72";
import {Transaction} from "@/transaction";
import {clearProgram, saleApprovalProgram} from "./Arc200Arc72Contract";

export async function Arc200Arc72SaleBuy(provider: Provider, account: Account, parameters: TransactionParameters) {

    const algosdk = provider.algosdk
    const algodClient = provider.algodClient as _algosdk.Algodv2

    const suggestedParams = await algodClient.getTransactionParams().do()

    const appAddress = algosdk.getApplicationAddress(parameters.appIndex)

    const abi = new algosdk.ABIContract(arc200Schema)
    const abiMethod = abi.getMethodByName('arc200_transfer')
    const args = [appAddress, parameters.price]
    const arc200AppArgs = encodeAppArgs(abiMethod, args)

    console.log(parameters.arc200AppID, typeof parameters.arc200AppID)

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

    const appArgs = [new TextEncoder().encode('buy')]
    const appCallObj: AppCallObject = {
        type: TransactionType.appl,
        from: account.address,
        appIndex: parameters.appIndex,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: appArgs,
        suggestedParams,
    }

    return [fundArc200Obj,
        arc200ApproveObj,
        preValidateObj,
        appCallObj]
}
export async function Arc200Arc72SaleCreate(provider: Provider, account: Account, parameters: TransactionParameters) {
    try {
        const algosdk = provider.algosdk
        const algodClient = provider.algodClient as _algosdk.Algodv2
        console.log(algodClient)


        const _price = parameters.price // * 1_000_000
        const suggestedParams = await algodClient.getTransactionParams().do()
        const appArgs = [
            longToByteArray(parameters.nftAppID, 8),
            longToByteArray(parameters.nftID, 32),
            longToByteArray(_price, 8),
            longToByteArray(parameters.arc200AppID, 8),
            algosdk.decodeAddress(parameters.arc200AppAddress).publicKey
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

        const appId = await new Transaction([appCreateObj])
            .getFutureAppId(algosdk, algodClient)

        // @ts-ignore
        const appAddr = algosdk.getApplicationAddress(appId)
        const suggestedParamsFund = await algodClient.getTransactionParams().do()
        const fundingAmount = 300_000

        const fundAppObj: PaymentObject = {
            type: TransactionType.pay,
            from: account.address,
            to: appAddr,
            amount: fundingAmount,
            suggestedParams: suggestedParamsFund,
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

        return [appCreateObj, fundAppObj, appCallObj]
    } catch (e) {
        console.log(e)
        throw {
            message: e
        }
    }
}
