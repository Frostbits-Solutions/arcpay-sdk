<script lang="ts" setup>
import {computed, inject, onBeforeMount, onMounted, ref} from 'vue'
import {Button} from '@/components/ui/button'
import {ChevronDown, ChevronRight, CircleHelp, LoaderCircle, OctagonAlert} from 'lucide-vue-next'
import {getShortAddress} from '@/lib/utils'
import Jazzicon from '@/components/Jazzicon.vue'
import {type WalletAccount, WalletId, type WalletManager, type WalletMetadata} from '@txnlab/use-wallet'

interface WalletSelectionProvider {
  callback: ((account: WalletAccount) => void)
}

interface Wallet {
  id: string
  metadata: WalletMetadata
  accounts: WalletAccount[]
  activeAccount: WalletAccount | null
  isConnected: boolean
  isActive: boolean
  connect: (args?: Record<string, any>) => Promise<WalletAccount[]>
  disconnect: () => Promise<void>
  setActive: () => void
  resumeSession: () => Promise<void>
  setActiveAccount: (address: string) => void
}

const manager = inject<WalletManager>('walletManager')
const {callback} = inject<{ WalletSelection: WalletSelectionProvider }>('appProvider')?.['WalletSelection'] || {}

const error = ref<string | undefined>()
const activeWallet = ref<Wallet | undefined>()
const accountLoading = ref<boolean>(false)
const wallets = computed(() => {
  if (!manager) return []
  return [...manager.wallets.values()].map((wallet): Wallet => {
    return {
      id: wallet.id,
      metadata: wallet.metadata,
      accounts: [],
      activeAccount: null,
      isConnected: wallet.isConnected,
      isActive: wallet.isActive,
      connect: (args) => wallet.connect(args),
      disconnect: () => wallet.disconnect(),
      setActive: () => wallet.setActive(),
      setActiveAccount: (addr) => wallet.setActiveAccount(addr),
      resumeSession: () => wallet.resumeSession()
    }
  })
})


// All of this will be needed when we allow magic wallet
const magicEmail = ref('')
const isMagicLink = (wallet: Wallet) => wallet.id === WalletId.MAGIC
const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(magicEmail.value)
const isConnectDisabled = (wallet: Wallet) => wallet.isConnected || (isMagicLink(wallet) && !isEmailValid())

const getConnectArgs = (wallet: Wallet) => {
  if (isMagicLink(wallet)) {
    return {email: magicEmail.value}
  }
  return undefined
}

async function selectWallet(wallet: Wallet) {
  wallet.setActive()
  activeWallet.value = wallet
  accountLoading.value = true
  if (wallet.isConnected && manager?.activeWallet !== undefined) {
    activeWallet.value.accounts = manager?.activeWallet.accounts || []
  } else {
    activeWallet.value.accounts = await wallet.connect(getConnectArgs(wallet))
  }
  accountLoading.value = false
  if (activeWallet.value?.accounts.length === 0) {
    error.value = 'Wallet does not have any accounts. Please select another wallet.'
  }
}

function disconnectWallet() {
  if (activeWallet.value) {
    activeWallet.value.disconnect()
    activeWallet.value = undefined
  }
}

async function selectAccount(account: WalletAccount) {
  if (callback && account) {
    manager?.activeWallet?.setActiveAccount(account.address)
    console.log(manager?.activeWalletAccounts)
    console.log(manager?.activeAddress)
    callback(account)
  } else {
    throw {message: 'Unexpected error: WalletSelectionCallback not provided'}
  }
}

onMounted(async () => {
  if (manager?.activeWallet?.activeAccount) {
    callback(manager?.activeWallet?.activeAccount)
  }
})
</script>

<template>
  <ul v-if="!activeWallet || accountLoading" class="ap-w-[350px] ap-mx-auto ap-mt-6 ap-flex ap-flex-col ap-gap-2">
    <li v-for="wallet in wallets" :key="wallet.id">
      <Button :disabled="isConnectDisabled(wallet)" class="ap-w-full ap-h-12 ap-justify-between ap-bg-background hover:ap-bg-background"
              variant="secondary"
              @click="selectWallet(wallet)">
        <div class="ap-flex ap-items-center ap-w-full">
          <img :alt="wallet.metadata.name" :src="wallet.metadata.icon" class="ap-w-6 ap-h-6 ap-mr-2"/>
          {{ wallet.metadata.name }}
        </div>
        <LoaderCircle v-if="activeWallet?.id === wallet.id"
                      class="ap-w-5 ap-h-5 ap-text-muted-foreground ap-animate-spin"/>
        <ChevronRight v-else class="ap-w-5 ap-h-5 ap-text-muted-foreground"/>
      </Button>
    </li>
    <li v-if="error"
        class="ap-text-xs ap-bg-destructive ap-text-destructive-foreground ap-py-2 ap-px-3 ap-rounded-md ap-mt-2 ap-flex ap-items-center">
      <OctagonAlert class="ap-w-6 ap-h-6 ap-mr-2"/>
      {{ error }}
    </li>
  </ul>
  <ul v-else class="ap-w-[350px] ap-mx-auto ap-mt-6 ap-flex ap-flex-col ap-gap-2">
    <li>
      <Button class="ap-w-full ap-h-12 ap-justify-between ap-bg-background hover:ap-bg-background" variant="secondary"
              @click="disconnectWallet">
        <div class="ap-flex ap-items-center ap-w-full">
          <img :alt="activeWallet?.metadata.name" :src="activeWallet?.metadata.icon" class="ap-w-6 ap-h-6 ap-mr-2"/>
          {{ activeWallet?.metadata.name }}
        </div>
        <ChevronDown class="ap-w-5 ap-h-5 ap-text-muted-foreground"/>
      </Button>
    </li>
    <li v-for="(account, index) in activeWallet.accounts" :key="account.address"
        :style="`animation-delay: ${index * 50}ms; animation-fill-mode: both;`"
        class="ap-animate-in ap-slide-in-from-bottom ap-fade-in">
      <Button class="ap-w-full ap-h-12 ap-justify-between hover:ap-bg-background" variant="ghost"
              @click="selectAccount(account)">
        <div class="ap-flex ap-items-center ap-w-full ap-text-xs ap-font-semibold">
          <Jazzicon :address="`0x${account.address}`" :diameter="25"
                    class="ap-w-[25px] ap-h-[25px] ap-mr-2 ap-shadow ap-rounded-full"/>
          <div class="ap-truncate">{{ account.name }}<span
              class="ap-text-muted-foreground ap-ml-2 ap-font-normal">{{ getShortAddress(account.address) }}</span>
          </div>
        </div>
        <div class="ap-w-4 ap-h-4 ap-border-2 ap-border-muted-foreground/40 ap-rounded ap-flex-shrink-0"></div>
      </Button>
    </li>
  </ul>
  <div
      class="ap-text-muted-foreground ap-flex ap-items-center ap-gap-1 ap-text-xs ap-underline ap-justify-center ap-mt-6">
    <CircleHelp class="ap-w-4 ap-h-4"/>
    Why do I need to connect with my wallet?
  </div>
</template>

<style scoped>

</style>
