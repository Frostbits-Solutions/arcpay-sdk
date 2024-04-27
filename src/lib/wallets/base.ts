import type _algosdk from 'algosdk'
import type { Wallet, ConfirmedTxn, RawTxnResponse } from '@/types'
import { Transaction } from 'algosdk'

abstract class BaseClient {
  algosdk: typeof _algosdk
  algodClient: _algosdk.Algodv2

  abstract connect(onDisconnect: () => void, arg?: any): Promise<Wallet>
  abstract disconnect(): Promise<void>
  abstract reconnect(onDisconnect: () => void): Promise<Wallet | null>
  abstract signTransactions(
    transactions: Transaction[],
    isAtomicTransactions: Boolean
  ): Promise<Uint8Array[]>

  protected constructor(
    algosdk: typeof _algosdk,
    algodClient: _algosdk.Algodv2,
  ) {
    this.algosdk = algosdk
    this.algodClient = algodClient
  }
  async waitForConfirmation(txId: string, timeout = 4) {
    const confirmation = (await this.algosdk.waitForConfirmation(
      this.algodClient,
      txId,
      timeout
    )) as ConfirmedTxn

    return { txId, ...confirmation }
  }

  decodeTransaction = (txn: string, isSigned: boolean) => {
    return isSigned
      ? this.algosdk.decodeSignedTransaction(new Uint8Array(Buffer.from(txn, 'base64'))).txn
      : this.algosdk.decodeUnsignedTransaction(new Uint8Array(Buffer.from(txn, 'base64')))
  }

  async sendRawTransactions(transactions: Uint8Array[], waitRoundsToConfirm?: number) {
    const sentTransaction = (await this.algodClient
      .sendRawTransaction(transactions)
      .do()) as RawTxnResponse

    if (!sentTransaction) {
      throw new Error('Transaction failed.')
    }

    const decodedTxn = this.algosdk.decodeSignedTransaction(transactions[0])
    const waitRounds = waitRoundsToConfirm || decodedTxn.txn.lastRound - decodedTxn.txn.firstRound

    const confirmedTransaction = await this.waitForConfirmation(sentTransaction.txId, waitRounds)

    return {
      id: sentTransaction.txId,
      ...confirmedTransaction
    }
  }

  logEncodedTransaction(txn: string, isSigned: boolean) {
    const txnObj = this.decodeTransaction(txn, isSigned)

    console.log('TRANSACTION', {
      isSigned,
      from: txnObj.from && this.algosdk.encodeAddress(txnObj.from.publicKey),
      to: txnObj.to && this.algosdk.encodeAddress(txnObj.to.publicKey),
      type: txnObj.type,
      txn: txnObj
    })
  }
}

export default BaseClient
