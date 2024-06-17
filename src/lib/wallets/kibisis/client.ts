import type {
  AlgorandProvider,
  IBaseResult,
  IEnableResult,
  ISignTxnsResult,
} from '@agoralabs-sh/algorand-provider';
import { assignGroupID, type Transaction } from 'algosdk'

import {
  ICON, KIBISIS_NOT_INSTALLED,
  NO_ALGO_WALLET_INSTALLED, UNKNOWN_ERROR
} from './constants'
import Wallet from '../Wallet';
import { bytesToBase64 } from '@agoralabs-sh/algorand-provider'
import { base64ToArrayBuffer } from '@/utils'
import type { AlgodClient } from '@/lib/algod/AlgodClient'
import type { Account } from '@/lib/wallets/types'

class Kibisis extends Wallet {
  constructor(algod: AlgodClient) {
    super(algod, 'kibisis', ICON)
  }

  async connect(onDisconnect: () => void): Promise<Wallet> {
    // @ts-ignore
    if (!window.algorand) {
      throw {
        code: NO_ALGO_WALLET_INSTALLED,
        message: 'No compatible browser extension wallet installed'// This error is thrown even if there is a compatible extension installed. Tested using Edge with Kibisis.
      };
    }

    // @ts-ignore
    const wallets: string[] = (window.algorand as AlgorandProvider).getWallets();
    if (!wallets.includes(this._id)){
      throw {
        code: KIBISIS_NOT_INSTALLED,
        message: 'Kibisis not installed or detected'
      };
    }

    try {
      // @ts-ignore
      const result: IBaseResult & IEnableResult = await window.algorand.enable({
        id: this._id,
      });

      const accounts: Account[] = []
      let index = 0
      for (const account of result.accounts) {
        accounts.push({
          providerId: this._id,
          address: account.address,
          name: account.name || `Account ${index}`
        })
        index ++
      }
      this._accounts = accounts

      return this as Wallet
    } catch (error) {
      console.log(error)
      throw new Error('Kibisis connection failed');
    }
  }

  async disconnect(): Promise<void> {
    return
  }

  async reconnect(onDisconnect: () => void): Promise<Wallet | null> {
    return this.connect(onDisconnect)
  }

  async signTransactions(transactions: Transaction[], isAtomicTransactions: Boolean) {
    try {
      if (isAtomicTransactions) {
        assignGroupID(transactions);
      }

      const txns = []
      for (const transaction of transactions){
        txns.push({
          txn: bytesToBase64(transaction.toByte())
          //signers: [], // an empty array instructs the wallet to skip signing this transaction
        })
      }
      //@ts-ignore
      const result: IBaseResult & ISignTxnsResult = await window.algorand.signTxns({
        txns
      });
      const signedTransactionBytes: Uint8Array[] = []
      for (const stxn of result.stxns) {
        if (typeof stxn === 'string'){
          signedTransactionBytes.push(base64ToArrayBuffer(stxn))
        }
      }

      return signedTransactionBytes
    } catch (error) {
      console.error(error)
      throw {
        code: UNKNOWN_ERROR,
        message: error
      }
    }
  }
}

export default Kibisis
