import type {AppCallObject, AppCreateObject, AppDeleteObject, PaymentObject, TransactionObject} from "@/types";
import type {Ref} from "vue";
import {defineStore} from "pinia";
import {ref} from "vue";
import _algosdk from "algosdk";
import arc200Schema from "@/lib/contracts/abi/arc200";
import {base64ToArrayBuffer, encodeAppArgs, longToByteArray} from "@/utils";
import {TransactionType} from "algosdk/src/types/transactions";
import {Transaction} from "@/transaction";
import {useWalletStore} from "@/stores/walletStore";
import {useParameterStore} from "@/stores/parameterStore";
import {clearProgram, dutchApprovalProgram as approvalProgram} from "@/lib/contracts/Arc200Arc72Contract";
import {arc72Schema} from "@/lib/contracts/abi/arc72";

const walletStore =  useWalletStore()

const parameterStore = useParameterStore()

const enum transactionState {
    idle,
    initiatingCreation,
    sendingCreation,
    initiationTransaction,
    sendingTransaction,
    error,
    success,
}

export const useTransactionStore = defineStore('transactionStore', () => {
    const state = ref(transactionState.idle)
    const errorInfo: Ref<object | null> = ref(null)
    const successInfo: Ref<object | null> = ref(null)
    const algosdk = walletStore?.provider?.algosdk
    const algodClient = walletStore?.provider?.algodClient as _algosdk.Algodv2

    function signAndSendTransactions (transactionObjects: Array<TransactionObject>) {
        try{
            if (!algosdk ||  !algodClient) {
                return {
                    confirmation: null,
                    error: {
                        message: "Transaction Store - No algosdk provided"
                    }
                }
            }
            if (!walletStore.provider) {
                return {
                    confirmation: null,
                    error: {
                        message: "Transaction Store - No wallet chosen"
                    }
                }
            }
            const txns =
                await new Transaction(transactionObjects)
                    .createTxns(algosdk, algodClient)

            const signedTxn = await walletStore.provider.signTransactions(txns, false)

            const confirmation = await walletStore.provider.sendRawTransactions(signedTxn)
            return {
                confirmation,
                error: null
            }
        } catch (error) {
            return {
                confirmation: null,
                error
            }
        }
    }
    async function Arc200Arc72DutchBuy() {
        if (!algosdk ||  !algodClient) {
            state.value = transactionState.error
            errorInfo.value = {
                    message: "Transaction Store - No algosdk provided"
                }
            return
        }
        if (!walletStore.account) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No account provided" }
            return
        }
        if (!parameterStore.arc200AppAddress) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - arc200AppAddress is null" }
            return
        }
        if (!parameterStore.arc200AppID) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - arc200AppID is null" }
            return
        }
        if (!parameterStore.appIndex) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - appIndex is null" }
            return
        }
        if (!parameterStore.seller) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - seller is null" }
            return
        }
        if (!parameterStore.nftAppID) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - nftAppID is null" }
            return
        }
        const suggestedParams = await algodClient.getTransactionParams().do()

        const abi = new algosdk.ABIContract(arc200Schema)
        const abiMethod = abi.getMethodByName('arc200_transfer')
        const args = [parameterStore.appAddress, parameterStore.price]
        const arc200AppArgs = encodeAppArgs(abiMethod, args)

        const fundArc200Obj: PaymentObject = {
            type: TransactionType.pay,
            from: walletStore.account.address,
            to: parameterStore.arc200AppAddress,
            amount: 28500,
            suggestedParams
        }

        const arc200ApproveObj: AppCallObject = {
            type: TransactionType.appl,
            suggestedParams: suggestedParams,
            from: walletStore.account.address,
            appIndex: parameterStore.arc200AppID,
            appArgs: arc200AppArgs,
            foreignApps: [parameterStore.arc200AppID],
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
        }

        const preValidateAppArgs = [new TextEncoder().encode('pre_validate')]
        const preValidateObj: AppCallObject = {
            type: TransactionType.appl,
            from: walletStore.account.address,
            appIndex: parameterStore.appIndex,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: preValidateAppArgs,
            accounts: [
                parameterStore.seller,
                parameterStore.feesAddress,
            ],
            foreignApps: [parameterStore.nftAppID, parameterStore.arc200AppID, parameterStore.appIndex],
            suggestedParams: suggestedParams,
        }

        const appArgs = [
            new TextEncoder().encode('buy'),
            longToByteArray(parameterStore.price, 8),
        ]
        const appCallObj: AppCallObject = {
            type: TransactionType.appl,
            from: walletStore.account.address,
            appIndex: parameterStore.appIndex,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: appArgs,
            suggestedParams,
        }

        const { confirmation, error } = signAndSendTransactions([fundArc200Obj, arc200ApproveObj, preValidateObj, appCallObj])

        if (error) {
            state.value = transactionState.error
            errorInfo.value = error
        } else {
            state.value = transactionState.success
            successInfo.value = confirmation
        }
    },
    async function Arc200Arc72DutchCreate() {
        if (!algosdk ||  !algodClient) {
            state.value = transactionState.error
            errorInfo.value = {
                    message: "Transaction Store - No algosdk provided"
                }
            return
        }
        if (!walletStore.account) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No account provided" }
            return
        }
        const _priceMin = parameterStore.priceMin
        const _priceMax = parameterStore.priceMax
        const suggestedParams = await algodClient.getTransactionParams().do()
        const appArgs = [
            longToByteArray(parameterStore.nftAppID, 8),
            longToByteArray(parameterStore.nftID, 32),
            longToByteArray(_priceMax, 8),
            longToByteArray(_priceMin, 8),
            longToByteArray((Date.now() + parameterStore.duration * 3_600_000) / 1_000, 8),
            longToByteArray(parameterStore.arc200AppID, 8),
            algosdk.decodeAddress(parameterStore.arc200AppAddress).publicKey,
        ]
        const appCreateObj =
            {
                type: TransactionType.appl,
                from: walletStore.account.address,
                onComplete: algosdk.OnApplicationComplete.NoOpOC,
                suggestedParams,
                appArgs,
                approvalProgram: base64ToArrayBuffer(approvalProgram),
                clearProgram: base64ToArrayBuffer(clearProgram),
                numGlobalInts: 7,
                numGlobalByteSlices: 7,
                numLocalInts: 0,
                numLocalByteSlices: 0,
            } as AppCreateObject

        const results = signAndSendTransactions([appCreateObj])
        console.log(results.confirmation, results.confirmation['application-index'])

        /*** Funding the application ***/
            // @ts-ignore
        const appAddr = algosdk.getApplicationAddress(results.confirmation['application-index'])
        const suggestedParamsFund = await algodClient.getTransactionParams().do()
        const fundingAmount = 300_000

        const fundAppObj: PaymentObject = {
            type: TransactionType.pay,
            from: walletStore.account.address,
            to: appAddr,
            amount: fundingAmount,
            suggestedParams: suggestedParamsFund,
        }

        const abi = new algosdk.ABIContract(arc72Schema)
        const abiMethod = abi.getMethodByName('arc72_approve')
        const args = [appAddr, parameterStore.nftID]
        const appArgsFund = encodeAppArgs(abiMethod, args)

        const appCallObj: AppCallObject = {
            type: TransactionType.appl,
            suggestedParams: suggestedParams,
            from: walletStore.account.address,
            appIndex: parameterStore.nftAppID,
            appArgs: appArgsFund,
            foreignApps: [parameterStore.nftAppID],
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
        }

        const { confirmation, error } = signAndSendTransactions([fundAppObj, appCallObj, appCallObj])

        if (error) {
            state.value = transactionState.error
            errorInfo.value = error
        } else {
            state.value = transactionState.success
            successInfo.value = confirmation
        }
    }

    async function Arc200Arc72SaleBuy() {
        if (!algosdk ||  !algodClient) {
            state.value = transactionState.error
            errorInfo.value = {
                    message: "Transaction Store - No algosdk provided"
                }
            return
        }
        if (!walletStore.account) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No account provided" }
            return
        }
        const suggestedParams = await algodClient.getTransactionParams().do()

        const appAddress = algosdk.getApplicationAddress(parameterStore.appIndex)

        const abi = new algosdk.ABIContract(arc200Schema)
        const abiMethod = abi.getMethodByName('arc200_transfer')
        const args = [appAddress, parameterStore.price]
        const arc200AppArgs = encodeAppArgs(abiMethod, args)


        const fundArc200Obj: PaymentObject = {
            type: TransactionType.pay,
            from: walletStore.account.address,
            to: parameterStore.arc200AppAddress,
            amount: 28500,
            suggestedParams
        }

        const arc200ApproveObj: AppCallObject = {
            type: TransactionType.appl,
            suggestedParams: suggestedParams,
            from: walletStore.account.address,
            appIndex: parameterStore.arc200AppID,
            appArgs: arc200AppArgs,
            foreignApps: [parameterStore.arc200AppID],
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
        }

        const preValidateAppArgs = [new TextEncoder().encode('pre_validate')]
        const preValidateObj: AppCallObject = {
            type: TransactionType.appl,
            from: walletStore.account.address,
            appIndex: parameterStore.appIndex,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: preValidateAppArgs,
            accounts: [
                parameterStore.seller,
                parameterStore.feesAddress,
            ],
            foreignApps: [parameterStore.nftAppID, parameterStore.arc200AppID, parameterStore.appIndex],
            suggestedParams: suggestedParams,
        }

        const appArgs = [new TextEncoder().encode('buy')]
        const appCallObj: AppCallObject = {
            type: TransactionType.appl,
            from: walletStore.account.address,
            appIndex: parameterStore.appIndex,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: appArgs,
            suggestedParams,
        }

        const { confirmation, error } = signAndSendTransactions([fundArc200Obj,
            arc200ApproveObj,
            preValidateObj,
            appCallObj])

        if (error) {
            state.value = transactionState.error
            errorInfo.value = error
        } else {
            state.value = transactionState.success
            successInfo.value = confirmation
        }
    }
    async function Arc200Arc72SaleCreate() {
        if (!algosdk ||  !algodClient) {
            state.value = transactionState.error
            errorInfo.value = {
                    message: "Transaction Store - No algosdk provided"
                }
            return
        }
        if (!walletStore.account) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No account provided" }
            return
        }
        const _price = parameterStore.price // * 1_000_000
        const suggestedParams = await algodClient.getTransactionParams().do()
        const appArgs = [
            longToByteArray(parameterStore.nftAppID, 8),
            longToByteArray(parameterStore.nftID, 32),
            longToByteArray(_price, 8),
            longToByteArray(parameterStore.arc200AppID.value, 8),
            algosdk.decodeAddress(parameterStore.arc200AppAddress).publicKey
        ]

        const appCreateObj =
            {
                type: TransactionType.appl,
                from: walletStore.account.address,
                onComplete: algosdk.OnApplicationComplete.NoOpOC,
                suggestedParams,
                appArgs,
                approvalProgram: base64ToArrayBuffer(approvalProgram),
                clearProgram: base64ToArrayBuffer(clearProgram),
                numGlobalInts: 7,
                numGlobalByteSlices: 7,
                numLocalInts: 0,
                numLocalByteSlices: 0,
            } as AppCreateObject

        const resultsCreation = signAndSendTransactions([appCreateObj])

        if (resultsCreation.error) {
            state.value = transactionState.error
            errorInfo.value = resultsCreation.error
        }
        console.log(resultsCreation.confirmation, resultsCreation.confirmation['application-index'])

        /*** Funding the application ***/
            // @ts-ignore
        const appAddr = algosdk.getApplicationAddress(resultsCreation.confirmation['application-index'])
        const suggestedParamsFund = await algodClient.getTransactionParams().do()
        const fundingAmount = 300_000

        const fundAppObj: PaymentObject = {
            type: TransactionType.pay,
            from: walletStore.account.address,
            to: appAddr,
            amount: fundingAmount,
            suggestedParams: suggestedParamsFund,
        }

        const abi = new algosdk.ABIContract(arc72Schema)
        const abiMethod = abi.getMethodByName('arc72_approve')
        const args = [appAddr, parameterStore.nftID]
        const appArgsFund = encodeAppArgs(abiMethod, args)

        const appCallObj: AppCallObject = {
            type: TransactionType.appl,
            suggestedParams: suggestedParams,
            from: walletStore.account.address,
            appIndex: parameterStore.nftAppID,
            appArgs: appArgsFund,
            foreignApps: [parameterStore.nftAppID],
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
        }

        const { confirmation, error } = signAndSendTransactions([fundAppObj, appCallObj])

        if (error) {
            state.value = transactionState.error
            errorInfo.value = error
        } else {
            state.value = transactionState.success
            successInfo.value = confirmation
        }
    },

    async function Arc200RwaSaleBuy() {
        if (!algosdk ||  !algodClient) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No algosdk provided" }
            return
        }
        if (!walletStore.account) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No account provided" }
            return
        }

        const suggestedParams = await algodClient.getTransactionParams().do()

        const appAddress = algosdk.getApplicationAddress(parameterStore.appIndex)

        const abi = new algosdk.ABIContract(arc200Schema)
        const abiMethod = abi.getMethodByName('arc200_transfer')
        const args = [appAddress, parameterStore.price]
        const arc200AppArgs = encodeAppArgs(abiMethod, args)


        const fundArc200Obj: PaymentObject = {
            type: TransactionType.pay,
            from: walletStore.account.address,
            to: parameterStore.arc200AppAddress,
            amount: 28500,
            suggestedParams
        }

        const arc200ApproveObj: AppCallObject = {
            type: TransactionType.appl,
            suggestedParams: suggestedParams,
            from: walletStore.account.address,
            appIndex: parameterStore.arc200AppID,
            appArgs: arc200AppArgs,
            foreignApps: [parameterStore.arc200AppID],
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
        }

        const preValidateAppArgs = [new TextEncoder().encode('pre_validate')]
        const preValidateObj: AppCallObject = {
            type: TransactionType.appl,
            from: walletStore.account.address,
            appIndex: parameterStore.appIndex,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: preValidateAppArgs,
            accounts: [
                parameterStore.seller,
                parameterStore.feesAddress,
            ],
            foreignApps: [parameterStore.arc200AppID, parameterStore.appIndex],
            suggestedParams: suggestedParams,
        }

        const appArgs = [new TextEncoder().encode('buy')]
        const appCallObj: AppCallObject = {
            type: TransactionType.appl,
            from: walletStore.account.address,
            appIndex: parameterStore.appIndex,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: appArgs,
            suggestedParams,
        }

        const { confirmation, error } = signAndSendTransactions([fundArc200Obj, arc200ApproveObj, preValidateObj, appCallObj])

        if (error) {
            state.value = transactionState.error
            errorInfo.value = error
        } else {
            state.value = transactionState.success
            successInfo.value = confirmation
        }
    }
    async function Arc200RwaSaleCreate() {
        if (!algosdk ||  !algodClient) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No algosdk provided" }
            return
        }
        if (!walletStore.account) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No account provided" }
            return
        }

        /*** Creation of the application ***/
        const _price = parameterStore.price
        const suggestedParams = await algodClient.getTransactionParams().do()
        const appArgs = [
            longToByteArray(_price, 32),
            algosdk.decodeAddress(parameterStore.feesAddress).publicKey,
            new TextEncoder().encode(parameterStore.name),
            new TextEncoder().encode(parameterStore.description),
            longToByteArray(parameterStore.arc200AppID.value, 8),
            algosdk.decodeAddress(parameterStore.arc200AppID).publicKey,
        ]

        const appCreateObj =
            {
                type: TransactionType.appl,
                from: walletStore.account.address,
                onComplete: algosdk.OnApplicationComplete.NoOpOC,
                suggestedParams,
                appArgs,
                approvalProgram: base64ToArrayBuffer(approvalProgram),
                clearProgram: base64ToArrayBuffer(clearProgram),
                numGlobalInts: 7,
                numGlobalByteSlices: 7,
                numLocalInts: 0,
                numLocalByteSlices: 0,
            } as AppCreateObject

        const txns =
            await new Transaction([appCreateObj])
                .createTxns(algosdk, algodClient)

        const resultCreation = signAndSendTransactions([appCreateObj])

        if (resultCreation.error) {
            state.value = transactionState.error
            errorInfo.value = resultCreation.error
        }

        console.log(resultCreation.confirmation, resultCreation.confirmation['application-index'])

        /*** Funding the application ***/
            // @ts-ignore
        const appAddr = algosdk.getApplicationAddress(resultCreation.confirmation['application-index'])
        const suggestedParamsFund = await algodClient.getTransactionParams().do()
        const fundingAmount = 300_000 + 10_000

        const fundAppObj: PaymentObject = {
            type: TransactionType.pay,
            from: walletStore.account.address,
            to: appAddr,
            amount: fundingAmount,
            suggestedParams: suggestedParamsFund,
        }

        const { confirmation, error } = signAndSendTransactions([fundAppObj])

        if (error) {
            state.value = transactionState.error
            errorInfo.value = error
        } else {
            state.value = transactionState.success
            successInfo.value = confirmation
        }
    }

    async function VoiArc72AuctionBid () {
        if (!algosdk ||  !algodClient) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No algosdk provided" }
            return
        }
        if (!walletStore.account) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No account provided" }
            return
        }
        const suggestedParams = await algodClient.getTransactionParams().do()

        const appAddress = algosdk.getApplicationAddress(parameterStore.appIndex)

        const payObj = {
            type: TransactionType.pay,
            from: walletStore.account.address,
            to: appAddress,
            amount: parameterStore.price * 1_000_000,
            suggestedParams
        }

        const appArgs = [new TextEncoder().encode('bid')]
        const appCallObj = {
            type: TransactionType.appl,
            from: walletStore.account.address,
            appIndex: parameterStore.appIndex,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: appArgs,
            suggestedParams,
        }

        const { confirmation, error } = signAndSendTransactions([payObj, appCallObj])

        if (error) {
            state.value = transactionState.error
            errorInfo.value = error
        } else {
            state.value = transactionState.success
            successInfo.value = confirmation
        }
    }
    async function VoiArc72AuctionCreate () {

        if (!algosdk ||  !algodClient) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No algosdk provided" }
            return
        }
        if (!walletStore.account) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No account provided" }
            return
        }

        /*** Creation of the application ***/
        const _reserve = parameterStore.reserve * 1_000_000
        const suggestedParams = await algodClient.getTransactionParams().do()
        const appArgs = [
            longToByteArray(parameterStore.nftAppID, 8),
            longToByteArray(parameterStore.nftID, 32),
            longToByteArray(_reserve, 8),
            algosdk.decodeAddress(parameterStore.feesAddress).publicKey,
            longToByteArray((Date.now() + parameterStore.duration * 3_600_000) / 1_000, 8)
        ]

        const appCreateObj =
            {
                type: TransactionType.appl,
                from: walletStore.account.address,
                onComplete: algosdk.OnApplicationComplete.NoOpOC,
                suggestedParams,
                appArgs,
                approvalProgram: base64ToArrayBuffer(approvalProgram),
                clearProgram: base64ToArrayBuffer(clearProgram),
                numGlobalInts: 7,
                numGlobalByteSlices: 7,
                numLocalInts: 0,
                numLocalByteSlices: 0,
            } as AppCreateObject

        const resultCreation = signAndSendTransactions([appCreateObj])

        if (resultCreation.error) {
            state.value = transactionState.error
            errorInfo.value = resultCreation.error
        }

        // @ts-ignore
        console.log(resultCreation.confirmation, resultCreation.confirmation['application-index'])

        /*** Funding the application ***/
            // @ts-ignore
        const appAddr = algosdk.getApplicationAddress(resultCreation.confirmation['application-index'])
        const suggestedParamsFund = await algodClient.getTransactionParams().do()
        const fundingAmount = 100_000 + 10_000

        const fundAppObj: PaymentObject = {
            type: TransactionType.pay,
            from: walletStore.account.address,
            to: appAddr,
            amount: fundingAmount,
            suggestedParams: suggestedParamsFund,
        }

        const abi = new algosdk.ABIContract(arc72Schema)
        const abiMethod = abi.getMethodByName('arc72_approve')
        const args = [appAddr, parameterStore.nftID]
        const appArgsFund = encodeAppArgs(abiMethod, args)

        const appCallObj: AppCallObject = {
            type: TransactionType.appl,
            suggestedParams: suggestedParams,
            from: walletStore.account.address,
            appIndex: parameterStore.nftAppID,
            appArgs: appArgsFund,
            foreignApps: [parameterStore.nftAppID],
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
        }

        const { confirmation, error } = signAndSendTransactions([fundAppObj, appCallObj])

        if (error) {
            state.value = transactionState.error
            errorInfo.value = error
        } else {
            state.value = transactionState.success
            successInfo.value = confirmation
        }
    }

    async function VoiArc72DutchBuy() {
        if (!algosdk ||  !algodClient) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No algosdk provided" }
            return
        }
        if (!walletStore.account) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No account provided" }
            return
        }

        const suggestedParams = await algodClient.getTransactionParams().do()

        const appAddress = algosdk.getApplicationAddress(parameterStore.appIndex)

        const preValidateAppArgs = [new TextEncoder().encode('pre_validate')]
        const preValidateObj = {
            type: TransactionType.appl,
            from: walletStore.account.address,
            appIndex: parameterStore.appIndex,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: preValidateAppArgs,
            accounts: [
                parameterStore.seller,
                parameterStore.feesAddress,
            ],
            foreignApps: [parameterStore.nftAppID],
            suggestedParams: suggestedParams,
        }

        const payObj = {
            type: TransactionType.pay,
            from: walletStore.account.address,
            to: appAddress,
            amount: parameterStore.price * 1_000_000,
            suggestedParams
        }

        const appArgs = [new TextEncoder().encode('buy')]
        const appCallObj = {
            type: TransactionType.appl,
            from: walletStore.account.address,
            appIndex: parameterStore.appIndex,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: appArgs,
            suggestedParams,
        }

        const { confirmation, error } = signAndSendTransactions([preValidateObj, payObj, appCallObj])

        if (error) {
            state.value = transactionState.error
            errorInfo.value = error
        } else {
            state.value = transactionState.success
            successInfo.value = confirmation
        }
    },
    async function VoiArc72DutchCreate () {
        if (!algosdk ||  !algodClient) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No algosdk provided" }
            return
        }
        if (!walletStore.account) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No account provided" }
            return
        }

        /*** Creation of the application ***/
        const _priceMin = parameterStore.priceMin.value * 1_000_000
        const _priceMax = parameterStore.priceMax.value * 1_000_000
        const suggestedParams = await algodClient.getTransactionParams().do()
        const appArgs = [
            longToByteArray(parameterStore.nftAppID, 8),
            longToByteArray(parameterStore.nftID, 32),
            longToByteArray(_priceMax, 8),
            longToByteArray(_priceMin, 8),
            longToByteArray((Date.now() + parameterStore.parameterStore.duration * 3_600_000) / 1_000, 8),
        ]

        const appCreateObj =
            {
                type: TransactionType.appl,
                from: walletStore.account.address,
                onComplete: algosdk.OnApplicationComplete.NoOpOC,
                suggestedParams,
                appArgs,
                approvalProgram: base64ToArrayBuffer(approvalProgram),
                clearProgram: base64ToArrayBuffer(clearProgram),
                numGlobalInts: 7,
                numGlobalByteSlices: 7,
                numLocalInts: 0,
                numLocalByteSlices: 0,
            } as AppCreateObject

        const resultCreation = signAndSendTransactions([appCreateObj])

        if (resultCreation.error) {
            state.value = transactionState.error
            errorInfo.value = resultCreation.error
        }

        // @ts-ignore
        console.log(resultCreation.confirmation, resultCreation.confirmation['application-index'])

        /*** Funding the application ***/
            // @ts-ignore
        const appAddr = algosdk.getApplicationAddress(resultCreation.confirmation['application-index'])
        const suggestedParamsFund = await algodClient.getTransactionParams().do()
        const fundingAmount = 100_000 + 10_000

        const fundAppObj: PaymentObject = {
            type: TransactionType.pay,
            from: walletStore.account.address,
            to: appAddr,
            amount: fundingAmount,
            suggestedParams: suggestedParamsFund,
        }

        const abi = new algosdk.ABIContract(arc72Schema)
        const abiMethod = abi.getMethodByName('arc72_approve')
        const args = [appAddr, parameterStore.nftID]
        const appArgsFund = encodeAppArgs(abiMethod, args)

        const appCallObj: AppCallObject = {
            type: TransactionType.appl,
            suggestedParams: suggestedParams,
            from: walletStore.account.address,
            appIndex: parameterStore.nftAppID,
            appArgs: appArgsFund,
            foreignApps: [parameterStore.nftAppID],
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
        }

        const { confirmation, error } = signAndSendTransactions([fundAppObj, appCallObj])
        if (error) {
            state.value = transactionState.error
            errorInfo.value = error
        } else {
            state.value = transactionState.success
            successInfo.value = confirmation
        }
    }

    async function VoiArc72SaleBuy () {
        if (!algosdk ||  !algodClient) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No algosdk provided" }
            return
        }
        if (!walletStore.account) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No account provided" }
            return
        }

        const suggestedParams = await algodClient.getTransactionParams().do()

        const appAddress = algosdk.getApplicationAddress(parameterStore.appIndex)

        const preValidateAppArgs = [new TextEncoder().encode('pre_validate')]
        const preValidateObj = {
            type: TransactionType.appl,
            from: walletStore.account.address,
            appIndex: parameterStore.appIndex,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: preValidateAppArgs,
            accounts: [
                parameterStore.seller,
                parameterStore.feesAddress,
            ],
            foreignApps: [parameterStore.nftAppID],
            suggestedParams: suggestedParams,
        }

        const payObj = {
            type: TransactionType.pay,
            from: walletStore.account.address,
            to: appAddress,
            amount: parameterStore.price * 1_000_000,
            suggestedParams
        }

        const appArgs = [new TextEncoder().encode('buy')]
        const appCallObj = {
            type: TransactionType.appl,
            from: walletStore.account.address,
            appIndex: parameterStore.appIndex,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: appArgs,
            suggestedParams,
        }

        const { confirmation, error } = signAndSendTransactions([preValidateObj, payObj, appCallObj])
        if (error) {
            state.value = transactionState.error
            errorInfo.value = error
        } else {
            state.value = transactionState.success
            successInfo.value = confirmation
        }
    }
    async function VoiArc72SaleCreate () {
        if (!algosdk ||  !algodClient) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No algosdk provided" }
            return
        }
        if (!walletStore.account) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No account provided" }
            return
        }

        /*** Creation of the application ***/
        const _price = parameterStore.price * 1_000_000
        const suggestedParams = await algodClient.getTransactionParams().do()
        const appArgs = [
            longToByteArray(parameterStore.nftAppID, 8),
            longToByteArray(parameterStore.nftID, 32),
            longToByteArray(_price, 8)
        ]

        const appCreateObj =
            {
                type: TransactionType.appl,
                from: walletStore.account.address,
                onComplete: algosdk.OnApplicationComplete.NoOpOC,
                suggestedParams,
                appArgs,
                approvalProgram: base64ToArrayBuffer(approvalProgram),
                clearProgram: base64ToArrayBuffer(clearProgram),
                numGlobalInts: 7,
                numGlobalByteSlices: 7,
                numLocalInts: 0,
                numLocalByteSlices: 0,
            } as AppCreateObject

        const resultCreation = signAndSendTransactions([appCreateObj])

        if (resultCreation.error) {
            state.value = transactionState.error
            errorInfo.value = resultCreation.error
        }

        // @ts-ignore
        console.log(resultCreation.confirmation, resultCreation.confirmation['application-index'])

        /*** Funding the application ***/
            // @ts-ignore
        const appAddr = algosdk.getApplicationAddress(resultCreation.confirmation['application-index'])
        const suggestedParamsFund = await algodClient.getTransactionParams().do()
        const fundingAmount = 300_000

        const fundAppObj: PaymentObject = {
            type: TransactionType.pay,
            from: walletStore.account.address,
            to: appAddr,
            amount: fundingAmount,
            suggestedParams: suggestedParamsFund,
        }

        const abi = new algosdk.ABIContract(arc72Schema)
        const abiMethod = abi.getMethodByName('arc72_approve')
        const args = [appAddr, parameterStore.nftID]
        const appArgsFund = encodeAppArgs(abiMethod, args)

        const appCallObj: AppCallObject = {
            type: TransactionType.appl,
            suggestedParams: suggestedParams,
            from: walletStore.account.address,
            appIndex: parameterStore.nftAppID,
            appArgs: appArgsFund,
            foreignApps: [parameterStore.nftAppID],
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
        }

        const { confirmation, error } = signAndSendTransactions([fundAppObj, appCallObj])
        if (error) {
            state.value = transactionState.error
            errorInfo.value = error
        } else {
            state.value = transactionState.success
            successInfo.value = confirmation
        }
    }


    async function VoiRwaSaleBuy () {
        if (!algosdk ||  !algodClient) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No algosdk provided" }
            return
        }
        if (!walletStore.account) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No account provided" }
            return
        }

        const suggestedParams = await algodClient.getTransactionParams().do()

        const appAddress = algosdk.getApplicationAddress(parameterStore.appIndex)


        const payObj = {
            type: TransactionType.pay,
            from: walletStore.account.address,
            to: appAddress,
            amount: parameterStore.price * 1_000_000,
            suggestedParams
        }

        const appArgs = [new TextEncoder().encode('buy')]
        const appCallObj = {
            type: TransactionType.appl,
            from: walletStore.account.address,
            appIndex: parameterStore.appIndex,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: appArgs,
            suggestedParams,
        }

        const { confirmation, error } = signAndSendTransactions([payObj, appCallObj])
        if (error) {
            state.value = transactionState.error
            errorInfo.value = error
        } else {
            state.value = transactionState.success
            successInfo.value = confirmation
        }
    }
    async function VoiRwaSaleCreate () {
        if (!algosdk ||  !algodClient) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No algosdk provided" }
            return
        }
        if (!walletStore.account) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No account provided" }
            return
        }

        const _price = parameterStore.price * 1_000_000
        const suggestedParams = await algodClient.getTransactionParams().do()
        const appArgs = [
            longToByteArray(_price, 8),
            algosdk.decodeAddress(parameterStore.feesAddress).publicKey,
            new TextEncoder().encode(parameterStore.name),
            new TextEncoder().encode(parameterStore.description)
        ]

        const appCreateObj =
            {
                type: TransactionType.appl,
                from: walletStore.account.address,
                onComplete: algosdk.OnApplicationComplete.NoOpOC,
                suggestedParams,
                appArgs,
                approvalProgram: base64ToArrayBuffer(approvalProgram),
                clearProgram: base64ToArrayBuffer(clearProgram),
                numGlobalInts: 7,
                numGlobalByteSlices: 7,
                numLocalInts: 0,
                numLocalByteSlices: 0,
            } as AppCreateObject

        const resultCreation = signAndSendTransactions([appCreateObj])

        if (resultCreation.error) {
            state.value = transactionState.error
            errorInfo.value = resultCreation.error
        }

        // @ts-ignore
        console.log(resultCreation.confirmation, resultCreation.confirmation['application-index'])

        /*** Funding the application ***/
            // @ts-ignore
        const appAddr = algosdk.getApplicationAddress(resultCreation.confirmation['application-index'])
        const suggestedParamsFund = await algodClient.getTransactionParams().do()
        const fundingAmount = 100_000 + 10_000

        const fundAppObj: PaymentObject = {
            type: TransactionType.pay,
            from: walletStore.account.address,
            to: appAddr,
            amount: fundingAmount,
            suggestedParams: suggestedParamsFund,
        }

        const { confirmation, error } = signAndSendTransactions([fundAppObj])
        if (error) {
            state.value = transactionState.error
            errorInfo.value = error
        } else {
            state.value = transactionState.success
            successInfo.value = confirmation
        }
    }
    async function Update () {
        if (!algosdk ||  !algodClient) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No algosdk provided" }
            return
        }
        if (!walletStore.account) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No account provided" }
            return
        }

        const suggestedParams = await algodClient.getTransactionParams().do()

        const _price = parameterStore.price * 1_000_000
        const appArgs = [
            new TextEncoder().encode('update_price'),
            longToByteArray(_price, 8)]
        const accounts = [parameterStore.feesAddress]

        const appCallObj: AppCallObject = {
            type: TransactionType.appl,
            appIndex: parameterStore.appIndex,
            from: walletStore.account.address,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs,
            accounts,
            suggestedParams
        }
        const { confirmation, error } = signAndSendTransactions([appCallObj])
        if (error) {
            state.value = transactionState.error
            errorInfo.value = error
        } else {
            state.value = transactionState.success
            successInfo.value = confirmation
        }
    }

    async function Cancel () {
        if (!algosdk ||  !algodClient) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No algosdk provided" }
            return
        }
        if (!walletStore.account) {
            state.value = transactionState.error
            errorInfo.value =
                { message: "Transaction Store - No account provided" }
            return
        }

        const suggestedParams = await algodClient.getTransactionParams().do()

        const accounts = [
            parameterStore.seller,
        ]
        const foreignApps = [parameterStore.appIndex, parameterStore.nftAppID]

        const appArgs = [new TextEncoder().encode('cancel')]
        const appCallObj: AppDeleteObject = {
            type: TransactionType.appl,
            from: walletStore.account.address,
            appIndex: parameterStore.appIndex,
            onComplete: algosdk.OnApplicationComplete.DeleteApplicationOC,
            accounts,
            appArgs,
            foreignApps,
            suggestedParams
        }

        const { confirmation, error } = signAndSendTransactions([appCallObj])
        if (error) {
            state.value = transactionState.error
            errorInfo.value = error
        } else {
            state.value = transactionState.success
            successInfo.value = confirmation
        }
    }

    return { }
})
