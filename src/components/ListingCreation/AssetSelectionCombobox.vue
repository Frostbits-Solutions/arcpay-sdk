<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import { CheckIcon } from '@radix-icons/vue'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { AssetMetadata } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'
import type { WalletAccount } from '@txnlab/use-wallet'
import type { NetworksConfig } from '@/lib/algod/networks.config'
import {WalletManager} from "@txnlab/use-wallet";

const props = defineProps<{account: WalletAccount | undefined, defaultValue: string | undefined}>()
const network = inject<NetworksConfig>('network')
const walletManager = inject<WalletManager>('walletManager')
const assets = ref<AssetMetadata[]>([])
const open = ref(false)
const value = ref('')
const loading = ref(true)
const selectedAsset = computed(() => {
  return assets.value.find((asset) => asset.id === value.value)
})

function getAssets() {
  if (network && walletManager && props.account?.address) {
    loading.value = true
    network.services.getAddressAssets(walletManager.algodClient, props.account.address).then((data) => {
      assets.value = data
      if (assets.value.findIndex((asset) => asset.id === props.defaultValue) !== -1) {
        value.value = props.defaultValue || ''
      }
      loading.value = false
    }).catch((error) => {
      console.error(error)
    })
  } else {
    console.error('Network or account not available')
  }
}

defineExpose({
  selectedAsset,
})

onMounted(async () => {
  getAssets()
})
</script>

<template>
  <Popover v-model:open="open" v-if="!loading">
    <PopoverTrigger as-child>
      <Button
        variant="ghost"
        role="combobox"
        :aria-expanded="open"
        class="ap-justify-between ap-w-[333px] ap-h-[333px] ap-flex ap-items-end ap-relative ap-rounded-2xl ap-p-0 ap-overflow-hidden ap-bg-muted ap-shadow-md hover:ap-shadow-xl ap-border ap-border-border/50 ap-transition"
      >
        <div class="ap-flex ap-items-center ap-gap-2 ap-min-w-0 ap-relative ap-z-10 ap-bg-background/50 ap-backdrop-blur-md ap-w-full ap-px-4 ap-py-2">
          <template v-if="!value">
            Click to select asset
          </template>
          <template v-else-if="selectedAsset">
            <div class="ap-text-xs ap-text-muted-foreground ap-min-w-0 ap-text-left">
              <div class="ap-font-semibold ap-text-foreground ap-truncate">{{ selectedAsset.name }}</div>
              {{ selectedAsset.id }}
            </div>
          </template>
        </div>
        <img
          v-if="selectedAsset"
          :src="selectedAsset.thumbnail"
          :alt="selectedAsset.id"
          class="ap-w-[333px] ap-h-[333px] ap-object-cover ap-absolute ap-top-0 ap-left-0 ap-z-0"
        />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="ap-p-0 ap-w-[333px] ap-h-[333px]" side="right" :side-offset="-333">
      <Command>
        <CommandInput class="ap-h-9" placeholder="Search by asset id" />
        <CommandEmpty>No asset found.</CommandEmpty>
        <CommandList>
          <CommandGroup class="ap-w-[326px]">
            <CommandItem
              v-for="asset in assets"
              :key="asset.id"
              :value="asset.id"
              @select="(ev) => {
                if (typeof ev.detail.value === 'string') {
                  value = ev.detail.value
                }
                open = false
              }">
              <div class="ap-flex ap-items-center ap-gap-2 ap-min-w-0">
                <img
                  :src="asset.thumbnail"
                  :alt="asset.id"
                  class="ap-w-12 ap-h-12 ap-mr-2 ap-rounded ap-object-cover ap-border"
                />
                <div class="ap-text-xs ap-text-muted-foreground ap-min-w-0">
                  <div class="ap-font-semibold ap-text-foreground ap-truncate">{{ asset.name }}</div>
                  {{ asset.id }}
                </div>
              </div>
              <CheckIcon :class="cn('ap-ml-auto ap-h-4 ap-w-4',value === asset.id ? 'ap-opacity-100' : 'ap-opacity-0',)"/>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
  <Skeleton v-else class="ap-w-[333px] ap-h-[333px] ap-p-2" />
</template>
