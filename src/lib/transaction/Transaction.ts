import type {
  AppCallObject,
  AppCreateObject,
  AppDeleteObject,
  AppObject,
  PaymentObject,
  TransactionObject,
  TransfertObject
} from './types'
import type { SuggestedParamsWithMinFee } from 'algosdk/dist/types/types/transactions/base'
import { TransactionType } from 'algosdk/src/types/transactions'
import algosdk, {type BoxReference, type TransactionSigner} from 'algosdk'
import { base64ToArrayBuffer, encodeAppArgs } from '@/lib/utils'
import { OnApplicationComplete } from 'algosdk/src/types/transactions/base'
import type { ABI } from '@/lib/contracts/abi/types'

export interface TransactionParameters {
  fromAddress: string
  appIndex?: number
}

export class TransactionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TransactionError'
  }
}

export class SimulationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SimulationError'
  }
}

export interface TransactionConfirmation {
  confirmedRound: number,
  txIDs: string[],
  methodResults: algosdk.ABIResult[],
  appIndex: number | undefined
}

type QueueMethods = '_createApp' | '_fund' | '_approve' | '_preValidate' | '_pay' | '_call' | '_delete'

type CreateAppArgs = [appArgs: Uint8Array[], approvalProgram: string, clearProgram: string, numGlobalInts?: number, numGlobalByteSlices?: number, numLocalInts?: number, numLocalByteSlices?: number]
type FundArgs = [amount?: number]
type ApproveArgs = [contractAbi: ABI, methodName: string, appIndex: number, foreignApps: number[], args: (string | number)[]]
type PreValidateArgs = [accounts?: string[], foreignApps?: number[]]
type PayArgs = [amount: number, to?: string]
type CallArgs = [functionName: string, args: Uint8Array[], accounts?: string[], foreignApps?: number[]]
type DeleteArgs = []

type QueueArgs =  CreateAppArgs | FundArgs | ApproveArgs | PreValidateArgs | PayArgs | CallArgs

interface QueueObject {
  method: QueueMethods,
  args: QueueArgs
}

export class Transaction {
  private readonly _objs: TransactionObject[]
  private readonly _queue: QueueObject[]
  private readonly _algod: algosdk.Algodv2
  private readonly _fromAddress: string | undefined
  private _suggestedParams: SuggestedParamsWithMinFee | undefined
  private _appIndex: number | undefined

  constructor(algod: algosdk.Algodv2, parameters: TransactionParameters) {
    this._algod = algod
    this._objs = []
    this._appIndex = parameters.appIndex
    this._fromAddress = parameters.fromAddress
    this._queue = []
  }

  public createApp(args: Uint8Array[], approvalProgram: string, clearProgram: string, numGlobalInts?: number, numGlobalByteSlices?: number, numLocalInts?: number, numLocalByteSlices?: number) {
    this._queue.push({ method: '_createApp', args: [ args, approvalProgram, clearProgram,  numGlobalInts, numGlobalByteSlices, numLocalInts, numLocalByteSlices] })
    return this
  }

  public fund(amount?: number) {
    this._queue.push({ method: '_fund', args: [ amount ] })
    return this
  }

  public approve(contractAbi: ABI, methodName:string, appIndex: number, foreignApps: number[], args: (string | number)[]) {
    this._queue.push({ method: '_approve', args: [ contractAbi, methodName, appIndex, foreignApps, args ] })
    return this
  }

  public preValidate(accounts?: string[], foreignApps?: number[]) {
    this._queue.push({ method: '_preValidate', args: [ accounts, foreignApps ] })
    return this
  }

  public pay(amount: number, to?: string) {
    this._queue.push({ method: '_pay', args: [ amount, to ] })
    return this
  }

  public call(functionName: string, args: Uint8Array[], accounts?: string[], foreignApps?: number[]) {
    this._queue.push({ method: '_call', args: [ functionName, args, accounts, foreignApps ] })
    return this
  }

  public delete() {
    this._queue.push({ method: '_delete', args: [] })
    return this
  }

  // Sign and send transaction
  public async send(transactionSigner: TransactionSigner): Promise<TransactionConfirmation> {
    for (const obj of this._queue) {
      const method: QueueMethods = obj.method
      const args: QueueArgs = obj.args
      switch (method) {
        case '_createApp':
          await this._createApp(...args as CreateAppArgs)
          break
        case '_fund':
          await this._fund(...args as FundArgs)
          break
        case '_approve':
          await this._approve(...args as ApproveArgs)
          break
        case '_preValidate':
          await this._preValidate(...args as PreValidateArgs)
          break
        case '_pay':
          await this._pay(...args as PayArgs)
          break
        case '_call':
          await this._call(...args as CallArgs)
          break
        case '_delete':
          await this._delete(...args as DeleteArgs)
          break
        default:
          throw new TransactionError(`Method ${method} not implemented`)
      }
    }
    const txns = await this._getTxns()
    const atc = new algosdk.AtomicTransactionComposer()
    for (const txn of txns) {
      atc.addTransaction({txn, signer: transactionSigner})
    }
    return new Promise<TransactionConfirmation>((resolve, reject) => {
      atc.execute(this._algod, 4).then(({confirmedRound, txIDs, methodResults}) => {
        resolve({confirmedRound, txIDs, methodResults, appIndex: this._appIndex})
      }).catch((error) => {
        reject(error)
      })
    })
  }

  private async _createApp(args: Uint8Array[], approvalProgram: string, clearProgram: string, numGlobalInts?: number, numGlobalByteSlices?: number, numLocalInts?: number, numLocalByteSlices?: number) {
    if (!this._fromAddress) throw new TransactionError('Unable to create app: From address not set.')
    const suggestedParams = await this._getSuggestedParams()
    const appCreateObj: AppCreateObject = {
      type: TransactionType.appl,
      from: this._fromAddress,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      suggestedParams,
      appArgs: [...args],
      approvalProgram: base64ToArrayBuffer(approvalProgram),
      clearProgram: base64ToArrayBuffer(clearProgram),
      numGlobalInts: numGlobalInts || 8,
      numGlobalByteSlices: numGlobalByteSlices || 7,
      numLocalInts: numLocalInts || 0,
      numLocalByteSlices: numLocalByteSlices || 0
    }
    this._objs.push(appCreateObj)

    this._appIndex = await this._getFutureAppIndex()
  }

  private async _fund(amount?:number) {
    const suggestedParams = await this._getSuggestedParams()
    if (!this._appIndex) throw new TransactionError('Unable to fund app: App index not set.')
    if (!this._fromAddress) throw new TransactionError('Unable to fund app: From address not set.')
    const appAddr = algosdk.getApplicationAddress(this._appIndex)
    const fundingAmount = amount || 700_000
    const fundAppObj: PaymentObject = {
      type: TransactionType.pay,
      from: this._fromAddress,
      to: appAddr,
      amount: fundingAmount,
      suggestedParams
    }
    this._objs.push(fundAppObj)
  }

  private async _approve(contractAbi: ABI, methodName: string, appIndex: number, foreignApps: number[], args: (string | number)[]) {
    if (!this._appIndex) throw new TransactionError('Unable to approve app: App index not set.')
    if (!this._fromAddress) throw new TransactionError('Unable to approve app: From address not set.')
    const suggestedParams = await this._getSuggestedParams()
    const abi = new algosdk.ABIContract(contractAbi)
    const abiMethod = abi.getMethodByName(methodName)
    const appAddr = algosdk.getApplicationAddress(this._appIndex)
    const appArgs = [appAddr, ...args]
    const encodedAppArgs = encodeAppArgs(abiMethod, appArgs)

    const appCallObj: AppCallObject = {
      type: TransactionType.appl,
      suggestedParams,
      from: this._fromAddress,
      appIndex,
      appArgs: encodedAppArgs,
      foreignApps: [...foreignApps],
      onComplete: algosdk.OnApplicationComplete.NoOpOC
    }

    this._objs.push(appCallObj)
  }

  private async _preValidate(accounts?: string[], foreignApps?: number[]) {
    if (!this._fromAddress) throw new TransactionError('Unable to pre-validate: From address not set.')
    if (!this._appIndex) throw new TransactionError('Unable to pre-validate: App index not set.')
    const suggestedParams = await this._getSuggestedParams()
    const preValidateObj: AppCallObject = {
      type: TransactionType.appl,
      from: this._fromAddress,
      appIndex: this._appIndex,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      appArgs: [new TextEncoder().encode('pre_validate')],
      suggestedParams: suggestedParams
    }
    if (accounts) preValidateObj.accounts = accounts
    if (foreignApps) preValidateObj.foreignApps = foreignApps
    this._objs.push(preValidateObj)
  }

  private async _pay(amount: number, to?: string) {
    if (!to) {
      if (!this._appIndex) throw new TransactionError('Unable to pay: App index not set.')
      to = algosdk.getApplicationAddress(this._appIndex)
    }
    if (!this._fromAddress) throw new TransactionError('Unable to pay: From address not set.')
    const suggestedParams = await this._getSuggestedParams()
    const microAlgoAmount = amount * 1_000_000
    const payObj: PaymentObject = {
      type: TransactionType.pay,
      from: this._fromAddress,
      to,
      amount: microAlgoAmount,
      suggestedParams
    }
    this._objs.push(payObj)
  }

  private async _call(functionName: string, args: Uint8Array[], accounts?: string[], foreignApps?: number[]) {
    if (!this._appIndex) throw new TransactionError('Unable to call: App index not set.')
    if (!this._fromAddress) throw new TransactionError('Unable to call: From address not set.')
    const suggestedParams = await this._getSuggestedParams()
    const appArgs = [new TextEncoder().encode(functionName), ...args]
    const appCallObj: AppCallObject = {
      type: TransactionType.appl,
      from: this._fromAddress,
      appIndex: this._appIndex,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      appArgs: appArgs,
      suggestedParams
    }
    if (accounts) appCallObj.accounts = accounts
    if (foreignApps) appCallObj.foreignApps = foreignApps
    this._objs.push(appCallObj)
  }

  private async _delete() {
    if (!this._appIndex) throw new TransactionError('Unable to delete app: App index not set.')
    if (!this._fromAddress) throw new TransactionError('Unable to delete app: From address not set.')
    const suggestedParams = await this._getSuggestedParams()
    const appDeleteObj: AppDeleteObject = {
      type: TransactionType.appl,
      from: this._fromAddress,
      appIndex: this._appIndex,
      onComplete: algosdk.OnApplicationComplete.DeleteApplicationOC,
      accounts: [this._fromAddress],
      appArgs: [new TextEncoder().encode('cancel')],
      foreignApps: [this._appIndex],
      suggestedParams
    }
    this._objs.push(appDeleteObj)
  }

  private async _getTxns(): Promise<algosdk.Transaction[]> {
    const results = await this._simulateTxn()
    if (results?.txnGroups[0]?.failureMessage) {
      throw new SimulationError(results.txnGroups[0].failureMessage)
    }

    // Get accounts accessed by the app and add them to the app object
    if (results?.txnGroups[0]?.unnamedResourcesAccessed?.accounts) {
      for (const obj of this._objs) {
        if (obj.type !== TransactionType.appl) {
          continue
        }

        const appObj = obj as AppObject
        const accounts = results?.txnGroups[0].unnamedResourcesAccessed.accounts
        if (appObj.accounts) {
          appObj.accounts = Array.from(new Set([...appObj.accounts, ...accounts]))
        } else {
          appObj.accounts = accounts
        }
      }
    }

    // Get boxes accessed by the app and add them to the app object
    if (results?.txnGroups[0]?.unnamedResourcesAccessed?.boxes) {
      let boxesStart = 0
      for (const obj of this._objs) {
        if (obj.type !== TransactionType.appl) {
          continue
        }

        const appObj = obj as AppObject
        const foreignApps: Array<number> = []
        appObj.boxes = results.txnGroups[0].unnamedResourcesAccessed.boxes.map((box) => {
          if (
            box.app !== 0
            && (!('appIndex' in appObj) || box.app !== appObj?.appIndex)
            && !foreignApps.includes(box.app as number)) {
            foreignApps.push(box.app as number)
          }
          return {
            appIndex: box.app,
            name: box.name
          } as BoxReference
        })

        if (appObj.foreignApps) {
          appObj.foreignApps = Array.from(new Set([...appObj.foreignApps, ...foreignApps]))
        } else {
          appObj.foreignApps = foreignApps
        }

        if (appObj.boxes.length + (appObj.accounts?.length || 0) + appObj.foreignApps.length > 8) {
          const nextStart = boxesStart + 8 - ((appObj.accounts?.length || 0) + appObj.foreignApps.length)
          appObj.boxes = appObj.boxes.slice(boxesStart, nextStart)
          boxesStart = nextStart
        }
      }
    }
    return this._objs.map(this._getTxn)
  }

  private async _getSuggestedParams() {
    if (!this._suggestedParams) {
      this._suggestedParams = await this._algod.getTransactionParams().do()
    }
    return this._suggestedParams
  }

  private async _getFutureAppIndex() {
    const results = await this._simulateTxn()
    if (results?.txnGroups[0]?.failureMessage) {
      throw new SimulationError(results.txnGroups[0].failureMessage)
    }
    return results.txnGroups[0].txnResults[0].txnResult.applicationIndex as number || 0
  }

  private async _simulateTxn() {
    const txns = this._objs.map(this._getTxn)
    algosdk.assignGroupID(txns);
    // Sign the transaction
    const stxns = txns.map(algosdk.encodeUnsignedSimulateTransaction)
    // Construct the simulation request
    const request = new algosdk.modelsv2.SimulateRequest({
      txnGroups: [
        new algosdk.modelsv2.SimulateRequestTransactionGroup({
          //@ts-ignore
          txns: stxns.map(algosdk.decodeObj)
        })
      ],
      allowUnnamedResources: true,
      allowEmptySignatures: true
    })

    // Simulate the transaction group
    return await this._algod
      .simulateTransactions(request)
      .do()
  }

  private _getTxn(obj: TransactionObject) {
    switch (obj.type) {
      case TransactionType.appl:
        if ((obj as AppCallObject).appIndex) {
          return algosdk.makeApplicationCallTxnFromObject(obj as AppCallObject)
        } else if ((obj as AppDeleteObject).onComplete === OnApplicationComplete.DeleteApplicationOC) {
          return algosdk.makeApplicationDeleteTxnFromObject(obj as AppDeleteObject)
        } else {
          return algosdk.makeApplicationCreateTxnFromObject(obj as AppCreateObject)
        }
      case TransactionType.pay:
        return algosdk.makePaymentTxnWithSuggestedParamsFromObject(obj as PaymentObject)
      case TransactionType.axfer:
        return algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(obj as TransfertObject)
      default:
        throw new TransactionError(`Transaction type ${obj.type} not implemented`)
    }
  }
}
