import { WalletConnectModalSign } from '@walletconnect/modal-sign-html'
import type { WalletConnectModalSignSession } from '@walletconnect/modal-sign-html'

import { assignGroupID, Transaction } from 'algosdk'
import Wallet from '../Wallet'
import { ARCPAY_METADATA } from './constants'
import { bytesToBase64 } from '@agoralabs-sh/algorand-provider'
import { formatJsonRpcRequest } from './utils'
import { Buffer } from 'buffer'
import type { AlgodClient } from '@/lib/algod/AlgodClient'
import type { Account, ProviderId } from '@/lib/wallets/types'
import WalletConnectIcon from '@/assets/wallet-logos/walletconnect.png'


class WalletConnect extends Wallet {
  private readonly _client: WalletConnectModalSign
  private readonly _chain: string = ''

  constructor(algod: AlgodClient) {
    super(algod, 'walletconnect')
    this._client = new WalletConnectModalSign(  {
        projectId: import.meta.env.VITE_WC_PROJECT_ID,
        metadata: ARCPAY_METADATA
    })

    this._chain = this._algod.config.blockchainId
  }

  static metadata = {
    id: 'walletconnect' as ProviderId,
    name: 'WalletConnect',
    icon: WalletConnectIcon
  }

  #mapAccounts(accounts: string[]): Account[] {
    return accounts.map((accountStr, index) => ({
      name: `WalletConnect ${index + 1}`,
      address: accountStr.split(':').pop() as string,
      providerId: this._id
    }))
  }

  async connect(onDisconnect: () => void): Promise<Wallet>{
    const requiredNamespaces = {
      algorand: {
        chains: [this._chain],
        methods: ['algo_signTxn'],
        events: []
      }
    }

    const session = await this._client.connect({ requiredNamespaces })
    const { accounts } = session.namespaces.algorand
    this._accounts = this.#mapAccounts(accounts)

    return this as Wallet
  }

  async disconnect() {
    const session = await this._client.getSession()
    if (session) {
      await this._client.disconnect({
        topic: session.topic,
        // replicates getSdkError('USER_DISCONNECTED') from @walletconnect/utils
        reason: {
          message: 'User disconnected.',
          code: 6000
        }
      })
    }
  }

  async reconnect(onDisconnect: () => void) {
    const session: WalletConnectModalSignSession | undefined = await this._client.getSession()

    if (typeof session === 'undefined') {
      return null
    }

    const { accounts } = session.namespaces.algorand
    this._accounts = this.#mapAccounts(accounts)

    return this as Wallet
  }

  async signTransactions(transactions: Transaction[], isAtomicTransactions: Boolean) {
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

    const request = formatJsonRpcRequest('algo_signTxn', [txns])
    const session = await this._client.getSession()

    if (!session) throw new Error('Session is not connected')

    const response = await this._client.request<Array<string | null>>({
      chainId: this._chain,
      topic: session.topic,
      request
    })

    const signedTransactionBytes: Uint8Array[] = []
    for (const stxn of response) {
      if (typeof stxn === 'string'){
        signedTransactionBytes.push(new Uint8Array(Buffer.from(stxn, 'base64')))
      }
    }

    return signedTransactionBytes
  }
}

export default WalletConnect
