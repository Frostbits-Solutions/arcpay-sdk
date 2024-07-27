<script lang="ts" setup>
import { Gavel, HandCoins, Receipt } from 'lucide-vue-next'
import AssetSelectionCombobox from '@/components/ListingCreation/AssetSelectionCombobox.vue'
import type { GetListingParamsOptions, WalletSelection } from '@/app'
import { inject } from 'vue'
import type { Account } from '@/lib/wallets'

interface ListingCreationProvider {
  args: {
    account: Account,
    options: GetListingParamsOptions
  },
  callback: ((selection: WalletSelection) => void)
}

const { args, callback } = inject<{ListingCreation: ListingCreationProvider}>('appProvider')?.['ListingCreation'] || {}
</script>

<template>
  <div class="ap-mt-4">
    <AssetSelectionCombobox :account="args?.account" :default-value="args?.options?.assetId"/>
    <div class="ap-grid ap-gap-4 ap-grid-cols-3 ap-w-[333px] ap-my-4">
      <RouterLink :to="{name: 'sale-creation'}"
                  class="ap-text-xs ap-cursor-pointer ap-flex ap-flex-col ap-items-center ap-justify-between ap-rounded-md ap-border-2 ap-border-muted ap-bg-popover ap-py-4 ap-px-2 hover:ap-bg-accent hover:ap-text-accent-foreground">
        <Receipt class="ap-mb-2 ap-h-6 ap-w-6" />
        Sale
      </RouterLink>
      <RouterLink :to="{name: 'auction-creation'}"
                  class="ap-text-muted-foreground ap-pointer-events-none ap-text-xs ap-cursor-pointer ap-flex ap-flex-col ap-items-center ap-justify-between ap-rounded-md ap-border-2 ap-border-muted ap-bg-popover ap-py-4 ap-px-2  hover:ap-bg-accent hover:ap-text-accent-foreground router-link-exact-active:ap-border-primary">
        <Gavel class="ap-mb-2 ap-h-6 ap-w-6" />
        Auction
      </RouterLink>
      <RouterLink :to="{name: 'dutch-creation'}"
                  class="ap-text-muted-foreground ap-pointer-events-none ap-text-xs ap-cursor-pointer ap-flex ap-flex-col ap-items-center ap-justify-between ap-rounded-md ap-border-2 ap-border-muted ap-bg-popover ap-py-4 ap-px-2  hover:ap-bg-accent hover:ap-text-accent-foreground router-link-exact-active:ap-border-primary">
        <HandCoins class="ap-mb-2 ap-h-6 ap-w-6" />
        Dutch auction
      </RouterLink>
    </div>
    <router-view/>
  </div>
</template>

<style scoped>
.router-link-exact-active {
  border-color: hsl(var(--primary));
}
</style>