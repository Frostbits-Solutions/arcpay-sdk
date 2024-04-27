import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { PROVIDER_ID } from '@/constants'
import type { Account, Wallet } from '@/types'
import Kibisis from '@/lib/wallets/kibisis'
import WalletConnect from '@/lib/wallets/walletConnect'


export const useWalletStore = defineStore('web3Store', () => {
  const walletId: Ref<PROVIDER_ID | null> = ref(null)
  const wallet: Ref<Wallet| null> = ref(null)
  const provider: Ref<Kibisis | WalletConnect | null> = ref(null)
  const account: Ref<Account| null> = ref(null)
  return { walletId, wallet, account, provider }
})
