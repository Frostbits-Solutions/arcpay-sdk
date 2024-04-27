import BaseClient from '../base';

import {
  bytesToBase64
} from '@agoralabs-sh/algorand-provider'
import type {
  AlgorandProvider,
  IBaseResult,
  IEnableResult,
  ISignTxnsResult,
} from '@agoralabs-sh/algorand-provider';

import _algosdk, {
  assignGroupID,
} from 'algosdk';
import type {
  Transaction
} from 'algosdk'

import type { Wallet, Account } from '@/types'
import {
  ARC_0027_CHANNEL_NAME, ARC_0027_PROVIDER_ID, ARC_0027_SIGN_TXNS_REQUEST, DEFAULT_REQUEST_TIMEOUT,
  ICON,
  KIBISIS_NOT_INSTALLED, METHOD_TIMED_OUT_ERROR,
  NO_ALGO_WALLET_INSTALLED, UNKNOWN_ERROR
} from '@/wallets/kibisis/constants'
import { PROVIDER_ID } from '@/constants'
import Algod from '@/algod'
import type {
  ProviderMethods, RequestMessage,
  ResponseError,
  ResponseMessage,
  SendRequestWithTimeoutOptions,
} from '@/wallets/kibisis/type'
import { generateUuid } from '@/wallets/kibisis/utils'
import { base64ToArrayBuffer } from '@/transactions/utils'

class Kibisis extends BaseClient {
  genesisHash: string|undefined
  genesisId: string|undefined
  sessionId: string|undefined

  static async init () {
    const algoD = await Algod.init()
    return new Kibisis(algoD.algosdk, algoD.algodClient)
  }

  static async sendRequestWithTimeout<Params, Result>({ method,
                                                        params,
                                                        timeout,
                                                        reference
                                                      }: SendRequestWithTimeoutOptions<Params>): Promise<Result | undefined> {
    return new Promise<Result | undefined>((resolve, reject) => {
      const channel = new BroadcastChannel(ARC_0027_CHANNEL_NAME)
      const requestId = generateUuid()
      // eslint-disable-next-line prefer-const
      let timer: number

      // listen to responses
      channel.onmessage = (message: MessageEvent<ResponseMessage<Result>>) => {
        // if the response's request id does not match the intended request, just ignore
        if (!message.data || message.data.requestId !== requestId) {
          return
        }

        // clear the timer, we can handle it from here
        window.clearTimeout(timer)

        // if there is an error, reject
        if (message.data.error) {
          reject(message.data.error)

          // close the channel, we are done here
          return channel.close()
        }

        // return the result
        resolve(message.data.result)

        // close the channel, we are done here
        return channel.close()
      }

      timer = window.setTimeout(() => {
        // close the channel connection
        channel.close()

        reject({
          code: METHOD_TIMED_OUT_ERROR,
          data: {
            method
          },
          message: `No response from wallet provider "${PROVIDER_ID.KIBISIS.toUpperCase()}"`,
          providerId: ARC_0027_PROVIDER_ID
        } as ResponseError<{ method: ProviderMethods }>)
      }, timeout || DEFAULT_REQUEST_TIMEOUT)

      // broadcast the request on the next tick
      // this allows the channel to be ready before the request is sent
      window.setTimeout(() => {
        channel.postMessage({
          id: requestId,
          params,
          reference
        } as RequestMessage<Params>)
      }, 0)
    })
  }

  constructor(
    algosdk: typeof _algosdk,
    algodClient: _algosdk.Algodv2
    ) {
    super(algosdk, algodClient)
  }

  async connect(onDisconnect: () => void, arg?: any): Promise<Wallet> {
    //@ts-ignore
    if (!window.algorand) {
      throw {
        code: NO_ALGO_WALLET_INSTALLED,
        message: 'No compatible browser extension wallet installed'// This error is thrown even if there is a compatible extension installed. Tested using Edge with Kibisis.
      };
    }

    // @ts-ignore
    const wallets: string[] = (window.algorand as AlgorandProvider).getWallets();
    if (!wallets.includes('kibisis')){
      throw {
        code: KIBISIS_NOT_INSTALLED,
        message: 'Kibisis not installed or detected'
      };
    }

    try {
      // @ts-ignore
      const result: IBaseResult & IEnableResult = await window.algorand.enable({
        id: 'kibisis',
      });

      console.log(result);
      this.genesisHash = result.genesisHash
      this.genesisId = result.genesisId
      this.sessionId = result.sessionId

      const accounts: Account[] = []
      for (const account of result.accounts)
        accounts.push({
          providerId: PROVIDER_ID.KIBISIS,
          address: account.address,
          name: account.name
        })

      return {
        id: PROVIDER_ID.KIBISIS,
        name: PROVIDER_ID.KIBISIS.toUpperCase(),
        icon: ICON,
        isWalletConnect: false,
        accounts: accounts
      }
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
      /*
      {
        id: 'awesome-wallet',
        stxns: [
          'gqNzaWfEQ...',
        ],
      }
      */

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

// class Kibisis implements Wallet {
//   async connect () {
//     // @ts-ignore
//     if (!window.algorand) {
//       throw new Error('no wallets are installed!');
//     }
//
//     // @ts-ignore
//     const wallets: string[] = (window.algorand as AlgorandProvider).getWallets();
//     if (!wallets.includes('kibisis')){
//       throw new Error('Kibisis is not installed');
//     }
//
//     try {
//       // @ts-ignore
//       const result: IBaseResult & IEnableResult = await window.algorand.enable({
//         id: 'kibisis',
//       });
//
//       console.log(result);
//       return result
//       /*
//       {
//         accounts: [
//           {
//             address: 'P3AIQVDJ2CTH54KSJE63YWB7IZGS4W4JGC53I6GK72BGZ5BXO2B2PS4M4U',
//             name: 'Wallet-1',
//           },
//           {
//             address: '6GT6EXFDAHZDZYUOPT725ZRWYBZDCEGYT7SYYXGJKRFUAG5B7JMI7DQRNQ',
//             name: 'Wallet-2',
//           },
//         ],
//         genesisHash: 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
//         genesisId: 'mainnet-v1.0',
//         id: 'awesome-wallet',
//         sessionId: 'ab192498-0c63-4028-80fd-f148710611d8',
//       }
//       */
//     } catch (error) {
//       console.log(error)
//       throw new Error('Connection to Kibisis failed');
//     }
//   }
//
//   async sign(transactions: Transaction[], isAtomicTransactions: Boolean) {
//     try {
//       if (isAtomicTransactions) {
//         assignGroupID(transactions);
//       }
//
//       const txns = []
//       for (const transaction of transactions){
//         txns.push({
//           txn: bytesToBase64(transaction.toByte())
//           //signers: [], // an empty array instructs the wallet to skip signing this transaction
//         })
//       }
//
//       // @ts-ignore
//       let result: IBaseResult & ISignTxnsResult = await window.algorand.signTxns(txns);
//
//       console.log(result);
//
//       return result.stxns
//     } catch (error) {
//       // handle error
//     }
//   }
// }
//
// export default Kibisis
