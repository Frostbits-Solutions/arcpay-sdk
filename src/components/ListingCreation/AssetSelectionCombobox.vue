<script lang="ts" setup>
import {computed, inject, onMounted, ref} from 'vue'
import {CheckIcon} from '@radix-icons/vue'
import {LoaderCircle} from "lucide-vue-next";
import { cn, formatAmountFromDecimals } from '@/lib/utils'
import {Button} from '@/components/ui/button'
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from '@/components/ui/command'
import {Popover, PopoverContent, PopoverTrigger,} from '@/components/ui/popover'
import type {AssetMetadata} from '@/lib/types'
import {Skeleton} from '@/components/ui/skeleton'
import type {WalletAccount} from '@txnlab/use-wallet'
import {WalletManager} from "@txnlab/use-wallet";
import type {NetworksConfig} from '@/lib/algod/networks.config'
import InfiniteLoading from "v3-infinite-loading";

const props = defineProps<{ account: WalletAccount | undefined, defaultValue: string | undefined }>()
const network = inject<NetworksConfig>('network')
const walletManager = inject<WalletManager>('walletManager')
const assets = ref<AssetMetadata[]>([])
const open = ref(false)
const value = ref('')
const initialLoading = ref(true)
const selectedAsset = computed(() => {
    return assets.value.find((asset) => asset.id === value.value)
})

let page = 1

async function getAssets(pageIndex: number) {
    if (network && walletManager && props.account?.address) {
        return network.services.getAddressAssets(walletManager.algodClient, props.account.address, pageIndex, 25).then((data) => {
            assets.value.push(...data)
            if (assets.value.findIndex((asset) => asset.id === props.defaultValue) !== -1) {
                value.value = props.defaultValue || ''
            }
            return data.length
        })
    } else {
        throw new Error('Network or account not available')
    }
}

async function load(state: any) {
  try {
      const len = await getAssets(page)
      if (len < 25) state.complete()
      else state.loaded()
      page++
  } catch(e) {
      console.error(e)
      state.error()
  }
}

defineExpose({
    selectedAsset,
})

onMounted(async () => {
    initialLoading.value = true
    await getAssets(0)
    initialLoading.value = false
})
</script>

<template>
    <Popover v-if="!initialLoading" v-model:open="open">
        <PopoverTrigger as-child>
            <Button :aria-expanded="open"
                    :class="['ap-w-[333px] ap-h-[333px] ap-flex ap-relative ap-rounded-3xl ap-p-0 ap-overflow-hidden ap-bg-background ap-shadow-2xl ap-border ap-border-border ap-transition hover:ap-bg-background', !value?'ap-items-center':'ap-items-end']"
                    role="combobox"
                    variant="ghost">
                <div v-if="!value" class="ap-text-muted-foreground ap-text-center">
                    Click to select asset
                </div>
                <div v-else-if="selectedAsset" class="ap-flex ap-flex-1 ap-min-w-0 ap-relative ap-z-10 ap-p-4">
                    <div class="ap-text-foreground  ap-min-w-0 ap-text-left">
                        <div class="ap-text-sm ap-inline-block ap-max-w-full ap-font-semibold ap-truncate ap-bg-background/50 ap-backdrop-blur-lg ap-px-1 ap-py-0.5 ap-rounded">
                            {{ selectedAsset.name }}
                        </div>
                        <div class="ap-text-xs  ap-table ap-bg-background/50 ap-backdrop-blur-lg ap-px-1 ap-py-0.5 ap-rounded">
                            {{ selectedAsset.id }}
                        </div>
                    </div>
                </div>
                <img v-if="selectedAsset" :alt="selectedAsset.id" :src="selectedAsset.thumbnail" class="ap-w-[333px] ap-h-[333px] ap-object-cover ap-absolute ap-top-0 ap-left-0 ap-z-0"/>
            </Button>
        </PopoverTrigger>
        <PopoverContent :side-offset="-333" class="ap-p-0 ap-w-[333px] ap-h-[333px]" side="right">
            <Command>
                <CommandInput class="ap-h-9" placeholder="Search by asset id"/>
                <CommandEmpty>
                    <div class="ap-text-muted-foreground ap-mt-8">
                        Wow, very empty.
                    </div>
                </CommandEmpty>
                <CommandList>
                    <CommandGroup class="ap-w-[326px]">
                        <CommandItem v-for="asset in assets" :key="asset.id" :value="asset.id"
                                     @select="(ev: CustomEvent) => {
                                         if (typeof ev.detail.value === 'string') {
                                             value = ev.detail.value
                                         }
                                         open = false
                                     }">
                            <div class="ap-flex ap-items-center ap-gap-2 ap-min-w-0">
                                <img :alt="asset.id" :src="asset.thumbnail" class="ap-w-12 ap-h-12 ap-mr-2 ap-rounded ap-object-cover ap-border ap-bg-muted"/>
                                <div class="ap-text-xs ap-text-muted-foreground ap-min-w-0">
                                    <div class="ap-font-semibold ap-text-foreground ap-truncate">{{ asset.name }} <span v-if="asset.subtype" class="ap-text-muted-foreground ap-font-normal">({{asset.subtype}})</span></div>
                                    ID: {{asset.id}}<br>
                                    Amount: {{formatAmountFromDecimals(asset.amount, asset.decimals)}}
                                </div>
                            </div>
                            <CheckIcon :class="cn('ap-ml-auto ap-h-4 ap-w-4',value === asset.id ? 'ap-opacity-100' : 'ap-opacity-0',)"/>
                        </CommandItem>
                        <InfiniteLoading @infinite="load">
                            <template #spinner>
                                <div class="ap-flex ap-justify-center ap-items-center ap-gap-2 ap-p-2 ap-text-xs ap-text-muted-foreground">
                                    <LoaderCircle class="ap-size-4 ap-text-primary ap-animate-spin ap-text-xs"/>
                                    Loading assets...
                                </div>
                            </template>
                            <template #complete>
                                <span class="ap-flex ap-justify-center ap-items-center ap-gap-2 ap-p-2 ap-text-xs ap-text-muted-foreground">That's all for now!</span>
                            </template>
                            <template #error>
                                <span class="ap-flex ap-justify-center ap-items-center ap-gap-2 ap-p-2 ap-text-xs ap-text-destructive">Unexpected error occurred while loading your assets</span>
                            </template>
                        </InfiniteLoading>
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
    <Skeleton v-else class="ap-w-[333px] ap-h-[333px] ap-p-2"/>
</template>
