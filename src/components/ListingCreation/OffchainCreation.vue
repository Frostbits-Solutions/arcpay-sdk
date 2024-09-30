<script setup lang="ts">

import CurrencySelectionCombobox from "@/components/ListingCreation/CurrencySelectionCombobox.vue";
import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput
} from "@/components/ui/number-field";
import {Label} from "@/components/ui/label";
import {computed, onMounted, ref} from "vue";
import {Button} from "@/components/ui/button";
import type {WalletAccount} from "@txnlab/use-wallet";
import type {CreateListingOptions, ListingCreationParams} from "@/lib/app";

const emit = defineEmits<{ (e: 'action:create-listing', params: ListingCreationParams): void }>()
const props = defineProps<{
    args: {
        account: WalletAccount,
        options: CreateListingOptions
    }
}>()
const currencySelectorRef = ref<typeof CurrencySelectionCombobox | null>(null)
const price = ref<number>(100)
const listingParams = computed(() => {
    return {
        type: 'sale',
        price: price.value,
        currency: currencySelectorRef.value?.selectedCurrency,
        asset: {
            id: props.args.options?.assetId,
            name: props.args.options?.listingName,
            description: '',
            thumbnail: props.args.options?.thumbnailUrl,
            type: 'offchain',
            thumbnailMIMEType: 'image/png',
            properties: {}
        }

    }
})

function createListing() {
    if (listingParams.value) {
        emit('action:create-listing', {
            ...listingParams.value,
        } as ListingCreationParams)
    }
}

onMounted(() => {
    if (!props.args.options?.assetId) throw new Error('Asset ID is required to create offchain listing')
    if (!props.args.options?.listingName) throw new Error('Listing name is required to create offchain listing')
})
</script>

<template>
    <div class="ap-mt-2">
        <h2 class="ap-font-medium ap-text-sm ap-mt-6 ap-mb-2">{{args.options?.listingName}}</h2>
        <div class="ap-w-[333px] ap-h-[333px] ap-relative ap-rounded-3xl ap-p-0 ap-overflow-hidden ap-bg-background ap-shadow-2xl ap-border ap-border-border ap-transition ap-mb-6" v-if="args.options?.thumbnailUrl">
            <img
                    :alt="args.options?.assetId"
                    :src="args.options.thumbnailUrl"
                    class="ap-w-[333px] ap-h-[333px] ap-object-cover ap-absolute ap-top-0 ap-left-0 ap-z-0"
            />
        </div>
        <Label class="ap-mb-1 ap-text-xs ap-text-muted-foreground" for="price">Asking price</Label>
        <div class="ap-flex ap-gap-1 ap-items-center ap-mt-2">
            <NumberField
                    id="price"
                    :format-options="{
                        style: 'decimal',
                        minimumFractionDigits: 2
                      }"
                    :model-value="price"
                    class="ap-flex-1"
                    @update:modelValue="(value: number) => price = value"
            >
                <NumberFieldContent>
                    <NumberFieldDecrement/>
                    <NumberFieldInput/>
                    <NumberFieldIncrement/>
                </NumberFieldContent>
            </NumberField>
            <CurrencySelectionCombobox ref="currencySelectorRef"/>
        </div>
        <Button class="ap-w-full ap-mt-10 ap-h-10" size="lg" variant="default" @click="createListing">Create listing</Button>
    </div>
</template>

<style scoped>

</style>