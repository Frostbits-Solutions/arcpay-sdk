import type { BoxReference, SuggestedParams } from 'algosdk'
import { TransactionType } from 'algosdk/src/types/transactions'
import { OnApplicationComplete } from 'algosdk'

export type PaymentObject = {
  type: TransactionType, // TransactionType.pay
  from: string,
  note?: Uint8Array | undefined,
  suggestedParams: SuggestedParams,
  to: string,
  amount: number | bigint,
  closeRemainderTo?: string | undefined,
  rekeyTo?: string | undefined, }

export type TransfertObject = {
  type: TransactionType, // TransactionType.axfer
  from: string,
  suggestedParams: SuggestedParams,
  to: string,
  amount: number | bigint,
  note?: Uint8Array | undefined,
  closeRemainderTo?: string | undefined,
  rekeyTo?: string | undefined,
  assetIndex: number,
  revocationTarget?: string | undefined,
}

export type AppCallObject = {
  type: TransactionType, // TransactionType.appl
  from: string,
  suggestedParams: SuggestedParams,
  appIndex: number,
  onComplete: OnApplicationComplete,
  appArgs?: Uint8Array[],
  accounts?: string[],
  foreignApps?: number[],
  foreignAssets?: number[],
  boxes?: BoxReference[],
  lease?: Uint8Array,
  rekeyTo?: string,
  note?: Uint8Array | undefined,
  extraPages?: number,
}

export type AppCreateObject = {
    type: TransactionType, // TransactionType.appl
    from: string,
    suggestedParams: SuggestedParams,
    onComplete: OnApplicationComplete,
    numLocalInts: number,
    numLocalByteSlices: number,
    numGlobalInts: number,
    numGlobalByteSlices: number,
    approvalProgram: Uint8Array,
    clearProgram: Uint8Array,
    note?: Uint8Array | undefined,
    appArgs?: Uint8Array[],
    accounts?: string[],
    foreignApps?: number[],
    foreignAssets?: number[],
    boxes?: BoxReference[],
    lease?: Uint8Array,
    rekeyTo?: string,
    extraPages?: number,
  }

export type AppDeleteObject = {
  type: TransactionType, // TransactionType.appl
  from: string,
  appIndex: number,
  suggestedParams: SuggestedParams,
  onComplete: OnApplicationComplete,
  note?: Uint8Array | undefined,
  appArgs?: Uint8Array[],
  accounts?: string[],
  foreignApps?: number[],
  foreignAssets?: number[],
  boxes?: BoxReference[],
  lease?: Uint8Array,
  rekeyTo?: string,
}

export type AppObject = AppCallObject | AppCreateObject | AppDeleteObject
export type TransactionObject = AppObject | PaymentObject | TransfertObject
