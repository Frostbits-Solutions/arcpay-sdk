import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { PROVIDER_ID } from '@/constants'
import type { Account, Wallet } from '@/types'
import Kibisis from '@/wallets/kibisis'
import WalletConnect from '@/wallets/walletConnect'


export const useWeb3Store = defineStore('web3Store', () => {
  const walletId: Ref<PROVIDER_ID | null> = ref(null)
  const wallet: Ref<Wallet| null> = ref(null)
  const provider: Ref<Kibisis | WalletConnect | null> = ref(null)
  const account: Ref<Account| null> = ref(null)
  return { walletId, wallet, account, provider }
})
