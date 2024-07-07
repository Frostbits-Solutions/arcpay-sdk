import {TRANSACTION_STATE} from "@/constants";
import _algosdk from "algosdk";
import {TransactionType} from "algosdk/src/types/transactions";
import {base64ToArrayBuffer, encodeAppArgs, longToByteArray} from "@/utils";
import type {Account, AppCallObject, AppCreateObject, PaymentObject, Provider, TransactionParameters} from "@/types";
import {arc72Schema} from "@/lib/contracts/abi/arc72";
import {Transaction} from "@/transaction";
import {auctionApprovalProgram, clearProgram} from "./Arc200Arc72Contract";
import arc200Schema from "@/lib/contracts/abi/arc200";

export async function Arc200Arc72AuctionBid (provider: Provider, account: Account, parameters: TransactionParameters) {

    const algosdk = provider.algosdk
    const algodClient = provider.algodClient as _algosdk.Algodv2

    const suggestedParams = await algodClient.getTransactionParams().do()

    const appAddress = algosdk.getApplicationAddress(parameters.appIndex)

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

    const appArgs = [
        new TextEncoder().encode('bid'),
        longToByteArray(parameters.price, 8),
    ]
    const appCallObj = {
        type: TransactionType.appl,
        from: account.address,
        appIndex: parameters.appIndex,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: appArgs,
        suggestedParams
    }

    return [fundArc200Obj, arc200ApproveObj, appCallObj]
}
export async function Arc200Arc72AuctionCreate (provider: Provider, account: Account, parameters: TransactionParameters) {
    const algosdk = provider.algosdk
    const algodClient = provider.algodClient as _algosdk.Algodv2
    console.log(parameters.priceMin)

    /*** Creation of the application ***/
    const startPrice = parameters.priceMin
    const suggestedParams = await algodClient.getTransactionParams().do()
    const appArgs = [
        longToByteArray(parameters.nftAppID, 8),
        longToByteArray(parameters.nftID, 32),
        longToByteArray(startPrice, 8),
        longToByteArray((Date.now() + parameters.duration * 300_000) / 1_000, 8),
        longToByteArray(parameters.arc200AppID, 8),
        algosdk.decodeAddress(parameters.arc200AppAddress).publicKey,
        algosdk.decodeAddress(parameters.counterPartyAddress).publicKey,
        longToByteArray(parameters.counterPartyFees, 8),
    ]

    const appCreateObj: AppCreateObject =
        {
            type: TransactionType.appl,
            from: account.address,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            suggestedParams,
            appArgs,
            approvalProgram: base64ToArrayBuffer(auctionApprovalProgram),
            clearProgram: base64ToArrayBuffer(clearProgram),
            numGlobalInts: 9,
            numGlobalByteSlices: 9,
            numLocalInts: 0,
            numLocalByteSlices: 0,
        }

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
