<template>
  <div class="w-full max-w-sm max-h-screen overflow-scroll rounded-xl border border-gray-200 bg-white p-4 shadow-xl sm:p-6 md:p-8 dark:border-gray-700 dark:bg-gray-800 animate-modal">
    <div class="mb-8 flex items-center justify-center">
      <img src="@/assets/logo.png" alt="Logo" class="w-12 h-12" />
      <h1 class="text-4xl ml-2 dark:text-white">arcpay</h1>
    </div>

    <router-view />

  </div>
</template>

<script setup lang="ts">
import type { PROVIDER_ID } from '@/constants'
import type { Account } from '@/types'
import type { TransactionParameters } from '@/types/transactions'
import type { Ref } from 'vue'

import { computed, ref } from 'vue'
import { useWalletStore } from '@/stores/walletStore'
import {
  TRANSACTION_TYPE,
  CONVENTION_TYPE,
  TRANSACTIONS_BUTTONS,
  TRANSACTIONS_STEPS, CONTRACT_TYPE
} from '@/constants'
import { PROVIDER, PROVIDER_ICONS } from '@/constants'
import IconChevronPrevious from '@/components/icons/IconChevronPrevious.vue'

const props = defineProps < {
  transactionType: TRANSACTION_TYPE,
  conventionType: CONVENTION_TYPE,
  contractType: CONTRACT_TYPE,
  parameters: TransactionParameters
}> ()

const web3Store = useWalletStore()
const reload = ref(0)
const currentTransactionStep: Ref<null | number> = ref(null)
const doneInformation: Ref<null | object> = ref(null)
const errorInformation: Ref<null | object> = ref(null)


const parameterArray = computed(() => {
  const parameterKeys = [
    'nftID',
    'minPrice',
    'price',
    'seller',
    'appIndex',
    //'nftAppID',
    //'arc200AppID',
    'feesAddress',
  ]
  const pArray: Array<{key: string, value: string|number}> = []
  for (const key of parameterKeys) {
    if (props.parameters[key as keyof TransactionParameters]) {
      pArray.push(formatParameters(key, props.parameters[key as keyof TransactionParameters]))
    }
  }

  return pArray
})

async function setWalletId (_walletId: PROVIDER_ID) {
  const provider = await PROVIDER[_walletId].init()
  const wallet = await provider.connect(() => {})
  if (wallet.accounts.length === 0) {
    throw { message: 'Wallet does not have any accounts'}
  } else if (wallet.accounts.length === 1) {
    setAccount(wallet.accounts[0])
  }
  web3Store.wallet = wallet
  web3Store.provider = provider
  web3Store.walletId = _walletId

  console.log(await provider.algodClient.status().do())
}

function setAccount (_account: Account) {
  web3Store.account = _account
}

function resetAddress () {
  localStorage.removeItem('gemsPayAccount')
  web3Store.account = null
  reload.value++
}

function resetWallet () {
  localStorage.removeItem('gemsPayWallet')
  web3Store.walletId = null
  resetAddress()
}

function getShortAddress (address: string): string {
  return `${address.slice(0,4)}...${address.slice(address.length - 5, address.length - 1)}`
}

function formatParameters (key: string, value: number|string) {
  switch (key) {
    case 'appIndex':
      return {
        key: 'Application ID',
        value: value
      }
    case 'nftID':
      return {
        key: 'NFT ID',
        value: value
      }
    case 'minPrice':
      return {
        key: 'Minimum bid price',
        value: value
      }
    case 'price':
      return {
        key: 'Price',
        value: value
      }
    case 'seller':
      return {
        key: 'NFT Seller',
        value:getShortAddress(value as string)
      }
    case 'nftAppID':
      return {
        key: 'Sold NFT Application ID',
        value: value
      }
    case 'arc200AppID':
      return {
        key: 'ARC 200 NFT Application ID',
        value: value
      }
    case 'feesAddress':
      return {
        key: 'Fees address',
        value:getShortAddress(value as string)
      }
    default:
      return {
        key,
        value
      }
  }
}
</script>

<style scoped>
</style>
