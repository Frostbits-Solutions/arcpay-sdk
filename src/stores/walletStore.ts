import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import type { Account } from '@/lib/wallets/types'
import Wallet from '@/lib/wallets/Wallet'
import Kibisis from '@/lib/wallets/kibisis'
import WalletConnect from '@/lib/wallets/walletConnect'


export const useWalletStore = defineStore('walletStore', () => {
  const walletId: Ref<number | null> = ref(null)
  const wallet: Ref<Wallet| null> = ref(null)
  const provider: Ref<Kibisis | WalletConnect | null> = ref(null)
  const account: Ref<Account| null> = ref(null)
  return { walletId, wallet, account, provider }
})
