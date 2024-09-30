<script lang="ts" setup>
import {Gavel, HandCoins, Receipt} from 'lucide-vue-next'
import AssetSelectionCombobox from '@/components/ListingCreation/AssetSelectionCombobox.vue'
import type {CreateListingOptions, ListingCreationParams} from '@/lib/app'
import {computed, ref, type VNodeRef} from 'vue'
import {Button} from '@/components/ui/button'
import {Label} from '@/components/ui/label'
import type {AssetMetadata} from '@/lib/types'
import type {WalletAccount} from "@txnlab/use-wallet";

const emit = defineEmits<{ (e: 'action:create-listing', params: ListingCreationParams): void }>()
const props = defineProps<{
    args: {
        account: WalletAccount,
        options: CreateListingOptions
    }
}>()
const assetSelectionComboboxRef = ref<VNodeRef | null>(null)
const ListingCreationComponentRef = ref<VNodeRef | null>(null)

const selectedAsset = computed<AssetMetadata>(() => {
    return assetSelectionComboboxRef.value?.selectedAsset
})

const listingParams = computed(() => {
    return ListingCreationComponentRef.value?.params
})

function createListing() {
    if (listingParams.value && selectedAsset.value) {
        emit('action:create-listing', {
            ...listingParams.value,
            asset: selectedAsset.value
        } as ListingCreationParams)
    }
}
</script>

<template>
    <div class="ap-flex ap-flex-col ap-gap-2 ap-mt-4 md:ap-flex-row md:ap-gap-8">
        <div class="ap-flex ap-flex-col ap-justify-center ap-mx-auto">
            <AssetSelectionCombobox ref="assetSelectionComboboxRef" :account="args?.account" :default-value="args?.options?.assetId"/>
        </div>
        <div class="ap-flex ap-flex-col ap-justify-between ap-w-[333px] ap-mx-auto">
            <div>
                <div v-if="!args?.options?.listingType">
                    <Label class="ap-text-xs ap-text-muted-foreground">Listing type</Label>
                    <div class="ap-grid ap-gap-[17px] ap-grid-cols-4 ap-mt-2">
                        <RouterLink :to="{name: 'sale-creation'}"
                                    class="ap-h-[74px] ap-text-xs ap-cursor-pointer ap-flex ap-flex-col ap-items-center ap-justify-center ap-gap-1 ap-rounded-md ap-border-2 ap-border-muted ap-bg-background ap-text-muted-foreground hover:ap-text-foreground">
                            <Receipt class="ap-h-5 ap-w-5"/>
                            Sale
                        </RouterLink>
                        <RouterLink :to="{name: 'auction-creation'}"
                                    class="ap-h-[74px] ap-text-xs ap-cursor-pointer ap-flex ap-flex-col ap-items-center ap-justify-center ap-gap-1 ap-rounded-md ap-border-2 ap-border-muted ap-bg-background ap-text-muted-foreground hover:ap-text-foreground">
                            <Gavel class="ap-h-5 ap-w-5"/>
                            Auction
                        </RouterLink>
                        <RouterLink :to="{name: 'dutch-creation'}"
                                    class="ap-text-center ap-h-[74px] ap-text-xs ap-cursor-pointer ap-flex ap-flex-col ap-items-center ap-justify-center ap-gap-1 ap-rounded-md ap-border-2 ap-border-muted ap-bg-background ap-text-muted-foreground hover:ap-text-foreground">
                            <HandCoins class="ap-h-5 ap-w-5"/>
                            Reverse
                        </RouterLink>
                    </div>
                </div>
                <div>
                    <router-view v-slot="{ Component }">
                        <component :is="Component" ref="ListingCreationComponentRef"/>
                    </router-view>
                </div>
            </div>
            <Button class="ap-w-full ap-mt-10 ap-h-10" size="lg" variant="default" @click="createListing">Create listing</Button>
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
    color: hsl(var(--foreground));
}
</style>