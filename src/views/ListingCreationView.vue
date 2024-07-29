<script lang="ts" setup>
import { Gavel, HandCoins, Receipt } from 'lucide-vue-next'
import AssetSelectionCombobox from '@/components/ListingCreation/AssetSelectionCombobox.vue'
import type { CreateListingOptions, ListingCreationParams } from '@/lib/app'
import { computed, inject, ref, type VNodeRef } from 'vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type {WalletAccount} from "@txnlab/use-wallet";
import type { OnChainAssetMetadata } from '@/lib/types'

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

const selectedAsset = computed<OnChainAssetMetadata>(() => {
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

</script>

<template>
  <div class="ap-flex ap-flex-col ap-gap-2 ap-mt-4">
    <AssetSelectionCombobox ref="assetSelectionComboboxRef" :account="args?.account" :default-value="args?.options?.assetId"/>
    <div>
      <Label class="ap-text-xs ap-text-muted-foreground ap-mb-1">Listing type</Label>
      <div class="ap-grid ap-gap-[17px] ap-grid-cols-4 ap-w-[333px]">
        <RouterLink :to="{name: 'sale-creation'}"
                    class="ap-text-xs ap-cursor-pointer ap-flex ap-flex-col ap-items-center ap-justify-center ap-gap-1 ap-rounded-md ap-border-2 ap-border-muted ap-bg-popover hover:ap-bg-accent hover:ap-text-accent-foreground">
          <Receipt class="ap-h-5 ap-w-5" />
          Sale
        </RouterLink>
        <RouterLink :to="{name: 'auction-creation'}"
                    class="ap-text-muted-foreground ap-pointer-events-none ap-h-[66px]  ap-text-xs ap-cursor-pointer ap-flex ap-flex-col ap-items-center ap-justify-center ap-gap-1 ap-rounded-md ap-border-2 ap-border-muted ap-bg-popover hover:ap-bg-accent hover:ap-text-accent-foreground">
          <Gavel class="ap-h-5 ap-w-5" />
          Auction
        </RouterLink>
        <RouterLink :to="{name: 'dutch-creation'}"
                    class="ap-text-muted-foreground ap-pointer-events-none ap-text-center ap-h-[66px] ap-text-xs ap-cursor-pointer ap-flex ap-flex-col ap-items-center ap-justify-center ap-gap-1 ap-rounded-md ap-border-2 ap-border-muted ap-bg-popover hover:ap-bg-accent hover:ap-text-accent-foreground">
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
    <Button variant="default" size="lg" class="ap-w-full ap-mt-6" @click="createListing()">Create listing</Button>
  </div>
</template>

<style scoped>
.router-link-exact-active {
  border-color: hsl(var(--primary));
}
</style>