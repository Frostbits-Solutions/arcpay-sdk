import type { ConfirmedTxn, RawTxnResponse } from './types'
import {
  Transaction,
  waitForConfirmation,
  decodeSignedTransaction,
  decodeUnsignedTransaction,
  encodeAddress
} from 'algosdk'
import { AlgodClient } from '@/lib/algod/AlgodClient'
import type { Account, ProviderId } from '@/lib/wallets/types'

export default abstract class Wallet {
  protected readonly _algod: AlgodClient
  protected readonly _id: ProviderId
  protected readonly _name: string
  protected readonly _icon: string
  protected _accounts: Account[] = []

  protected constructor( algod: AlgodClient, id: ProviderId, icon: string) {
    this._algod = algod
    this._id = id
    this._name = id.toUpperCase()
    this._icon = icon
  }

  abstract connect(onDisconnect: () => void): Promise<Wallet>
  abstract disconnect(): Promise<void>
  abstract reconnect(onDisconnect: () => void): Promise<Wallet | null>
  abstract signTransactions(
    transactions: Transaction[],
    isAtomicTransactions: Boolean
  ): Promise<Uint8Array[]>

  get metadata() {
    return {
      id: this._id,
      name: this._name,
      icon: this._icon,
    }
  }

  get accounts() {
    return this._accounts
  }

  public async waitForConfirmation(txId: string, timeout = 4) {
    const confirmation = (await waitForConfirmation(
      this._algod.client,
      txId,
      timeout
    )) as ConfirmedTxn

    return { txId, ...confirmation }
  }

  public decodeTransaction = (txn: string, isSigned: boolean): Transaction => {
    return isSigned
      ? decodeSignedTransaction(new Uint8Array(Buffer.from(txn, 'base64'))).txn
      : decodeUnsignedTransaction(new Uint8Array(Buffer.from(txn, 'base64')))
  }

  public async sendRawTransactions(transactions: Uint8Array[], waitRoundsToConfirm?: number) {
    const { txId } = (
      await this._algod.client.sendRawTransaction(transactions).do()
    ) as RawTxnResponse

    if (!txId) {
      throw new Error('Transaction failed.')
    }

    const decodedTxn = decodeSignedTransaction(transactions[0])
    const waitRounds = waitRoundsToConfirm || decodedTxn.txn.lastRound - decodedTxn.txn.firstRound

    const confirmedTransaction = await this.waitForConfirmation(txId, waitRounds)

    return {
      id: txId,
      ...confirmedTransaction
    }
  }

  public logEncodedTransaction(txn: string, isSigned: boolean) {
    const txnObj = this.decodeTransaction(txn, isSigned)

    console.log('TRANSACTION', {
      isSigned,
      from: txnObj.from && encodeAddress(txnObj.from.publicKey),
      to: txnObj.to && encodeAddress(txnObj.to.publicKey),
      type: txnObj.type,
      txn: txnObj
    })
  }
}
