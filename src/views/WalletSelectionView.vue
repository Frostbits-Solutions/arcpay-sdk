<script setup lang="ts">
import { inject, ref } from 'vue'
import type { AlgodClient } from '@/lib/algod/AlgodClient'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronDown, CircleHelp } from 'lucide-vue-next'
import { getShortAddress } from '@/lib/utils'
import Jazzicon from '@/components/Jazzicon.vue'
import type { WalletSelection } from '@/app'
import {useWallet, type Wallet, type WalletAccount, WalletId} from "@txnlab/use-wallet-vue";
const { wallets, activeWallet, activeAccount, signTransactions, transactionSigner } = useWallet()

console.log(useWallet())
interface WalletSelectionProvider {
  callback: ((selection: WalletSelection) => void)
}

const algod:AlgodClient | undefined = inject('algod')
const { callback } = inject<{WalletSelection: WalletSelectionProvider}>('appProvider')?.['WalletSelection'] || {}
const error = ref<string | undefined>()

// All of this will be needed when we allow magic wallet
const isMagicLink = (wallet: Wallet) => wallet.id === WalletId.MAGIC
const magicEmail = ref('')
const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(magicEmail.value)
const isConnectDisabled = (wallet: Wallet) =>
  wallet.isConnected || (isMagicLink(wallet) && !isEmailValid())

const getConnectArgs = (wallet: Wallet) => {
  if (isMagicLink(wallet)) {
    return { email: magicEmail.value }
  }
  return undefined
}

async function selectWallet(wallet: Wallet) {
  if (algod) {
    console.log(wallet)
    await wallet.connect(getConnectArgs(wallet))
    if (wallet.accounts.length === 0) {
      error.value = 'Wallet does not have any accounts. Please select another wallet.'
    }
  }
}

async function selectAccount(account: WalletAccount) {
  activeWallet.value?.setActiveAccount(account.address)
  if (callback && activeWallet.value && activeAccount.value) {
    callback({
      wallet: activeWallet.value,
      account: activeAccount.value
    })
  } else {
    throw { message: 'Unexpected error: WalletSelectionCallback not provided'}
  }
}
</script>

<template>
  <ul class="ap-w-[350px] ap-mt-6 ap-flex ap-flex-col ap-gap-2" v-if="!activeWallet">
    <li v-for="wallet in wallets" :key="wallet.id">
      <Button @click="selectWallet(wallet)" variant="secondary" class="ap-w-full ap-h-12 ap-justify-between" :disabled="isConnectDisabled(wallet)">
        <div class="ap-flex ap-items-center ap-w-full">
          <img :src="wallet.metadata.icon" :alt="wallet.metadata.name" class="ap-w-6 ap-h-6 ap-mr-2" />
          {{ wallet.metadata.name }}
        </div>
        <ChevronRight class="ap-w-5 ap-h-5 ap-text-muted-foreground" />
      </Button>
    </li>
    <li v-if="error">
      {{ error }}
    </li>
  </ul>
  <ul v-else class="ap-w-[350px] ap-mt-6 ap-flex ap-flex-col ap-gap-2">
    <li>
      <Button @click="activeWallet?.disconnect()" variant="secondary" class="ap-w-full ap-h-12 ap-justify-between">
        <div class="ap-flex ap-items-center ap-w-full">
          <img :src="activeWallet?.metadata.icon" :alt="activeWallet?.metadata.name" class="ap-w-6 ap-h-6 ap-mr-2" />
          {{ activeWallet?.metadata.name }}
        </div>
        <ChevronDown class="ap-w-5 ap-h-5 ap-text-muted-foreground" />
      </Button>
    </li>
    <li v-for="(account, index) in activeWallet.accounts" :key="account.address" class="ap-animate-in ap-slide-in-from-bottom ap-fade-in" :style="`animation-delay: ${index * 50}ms; animation-fill-mode: both;`">
      <Button @click="selectAccount(account)"  variant="ghost" class="ap-w-full ap-h-12 ap-justify-between">
        <div class="ap-flex ap-items-center ap-w-full ap-text-xs ap-font-semibold">
          <Jazzicon :address="`0x${account.address}`" :diameter="25" class="ap-w-[25px] ap-h-[25px] ap-mr-2 ap-shadow ap-rounded-full" />
          <div class="ap-truncate">{{ account.name }}<span class="ap-text-muted-foreground ap-ml-2 ap-font-normal">{{ getShortAddress(account.address) }}</span></div>
        </div>
        <div class="ap-w-4 ap-h-4 ap-border-2 ap-border-muted-foreground/40 ap-rounded ap-flex-shrink-0"></div>
      </Button>
    </li>
  </ul>
  <div class="ap-text-muted-foreground ap-flex ap-items-center ap-gap-1 ap-text-xs ap-underline ap-justify-center ap-mt-6">
    <CircleHelp class="ap-w-4 ap-h-4" />
    Why do I need to connect with my wallet?
  </div>
</template>

<style scoped>

</style>
