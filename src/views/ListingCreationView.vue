<script lang="ts" setup>
import { Gavel, HandCoins, Receipt } from 'lucide-vue-next'
import AssetSelectionCombobox from '@/components/ListingCreation/AssetSelectionCombobox.vue'
import type { CreateListingOptions, ListingCreationParams } from '@/lib/app'
import { computed, inject, onMounted, ref, type VNodeRef } from 'vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type {WalletAccount} from "@txnlab/use-wallet";
import type { AssetMetadata } from '@/lib/types'
import router from '@/router'

interface ListingCreationProvider {
  args: {
    account: WalletAccount,
    options: CreateListingOptions
  },
  callback: ((params: ListingCreationParams) => void)
}

const { args, callback } = inject<{ListingCreation: ListingCreationProvider}>('appProvider')?.['ListingCreation'] || {}
const assetSelectionComboboxRef = ref<VNodeRef | null>(null)
const ListingCreationComponentRef = ref<VNodeRef | null>(null)

const selectedAsset = computed<AssetMetadata>(() => {
  return assetSelectionComboboxRef.value?.selectedAsset
})

const listingParams = computed(() => {
  return ListingCreationComponentRef.value?.params
})

function createListing() {
  if (listingParams.value && selectedAsset.value && callback) {
    callback({
      asset: selectedAsset.value,
      ...listingParams.value
    })
  }
}

onMounted(() => {
  if (args?.options?.listingType) {
    router.push({name: `${args.options.listingType}-creation`})
  }
})
</script>

<template>
  <div class="ap-flex ap-flex-col ap-gap-2 ap-mt-4 md:ap-flex-row md:ap-gap-8">
    <div class="ap-flex ap-flex-col ap-justify-start">
      <AssetSelectionCombobox ref="assetSelectionComboboxRef" :account="args?.account" :default-value="args?.options?.assetId"/>
    </div>
    <div class="ap-flex ap-flex-col ap-justify-between">
      <div>
        <div v-if="!args?.options?.listingType">
          <Label class="ap-text-xs ap-text-muted-foreground">Listing type</Label>
          <div class="ap-grid ap-gap-[17px] ap-grid-cols-3 ap-w-[333px] ap-mt-2">
            <RouterLink :to="{name: 'sale-creation'}"
                        class="ap-h-[99px] ap-text-xs ap-cursor-pointer ap-flex ap-flex-col ap-items-center ap-justify-center ap-gap-1 ap-rounded-md ap-border-2 ap-border-muted ap-bg-popover hover:ap-bg-accent hover:ap-text-accent-foreground">
              <Receipt class="ap-h-5 ap-w-5" />
              Sale
            </RouterLink>
            <RouterLink :to="{name: 'auction-creation'}"
                        class="ap-h-[99px] ap-text-xs ap-cursor-pointer ap-flex ap-flex-col ap-items-center ap-justify-center ap-gap-1 ap-rounded-md ap-border-2 ap-border-muted ap-bg-popover hover:ap-bg-accent hover:ap-text-accent-foreground">
              <Gavel class="ap-h-5 ap-w-5" />
              Auction
            </RouterLink>
            <RouterLink :to="{name: 'dutch-creation'}"
                        class="ap-text-center ap-h-[99px] ap-text-xs ap-cursor-pointer ap-flex ap-flex-col ap-items-center ap-justify-center ap-gap-1 ap-rounded-md ap-border-2 ap-border-muted ap-bg-popover hover:ap-bg-accent hover:ap-text-accent-foreground">
              <HandCoins class="ap-h-5 ap-w-5" />
              Reverse
            </RouterLink>
          </div>
        </div>
        <div>
          <router-view v-slot="{ Component }">
            <component ref="ListingCreationComponentRef" :is="Component" />
          </router-view>
        </div>
      </div>
      <Button variant="default" size="lg" class="ap-w-full ap-mt-10" @click="createListing()">Create listing</Button>
    </div>
  </div>
</template>

<style scoped>
.router-link-exact-active {
  border-color: transparent;
  background-image: linear-gradient(hsl(var(--background)), hsl(var(--background))),
  var(--gradient);
  background-origin: border-box;
  background-clip: content-box, border-box;
}
</style>