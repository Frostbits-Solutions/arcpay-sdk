<script setup lang="ts">
import CountUp from "vue-countup-v3";
import type {ListingParams} from "@/lib/app/reviewListing";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput
} from "@/components/ui/number-field";
import {ref} from "vue";
import {Button} from "@/components/ui/button";
import ListingStatusChip from "@/components/ListingReview/ListingStatusChip.vue";

defineProps<{listingParams: ListingParams, previewLink: string}>()
const emit = defineEmits<{
  'action:buy': [price: number]
}>()
const price = ref<number>(100)
</script>

<template>
  <div>
    <h1 class="ap-text-2xl ap-text-foreground ap-mr-1 ap-truncate ap-max-w-72 ap-pl-2">
      {{ listingParams.name }}
    </h1>
    <div class="ap-flex ap-items-center ap-gap-1 ap-mt-1">
      <ListingStatusChip :listing-params="listingParams"/>
      <div class="ap-text-xs ap-text-foreground ap-bg-background/70 ap-rounded-full ap-px-2.5 ap-py-1.5">{{listingParams.type}}</div>
      <div class="ap-text-xs ap-text-foreground ap-bg-background/70 ap-rounded-full ap-px-2.5 ap-py-1.5">{{listingParams.asset_type}}</div>
    </div>
  </div>
  <div class="ap-flex ap-gap-6 ap-items-stretch">
    <div class="ap-flex ap-items-center">
      <a :href="previewLink"
         target="_blank"
         class="ap-block ap-max-w-[275px] ap-max-h-[275px] ap-relative ap-rounded-2xl ap-overflow-hidden ap-shadow-2xl ap-border ap-border-border ap-mt-6">
        <img
            v-if="listingParams.asset_thumbnail"
            :src="listingParams.asset_thumbnail"
            :alt="listingParams.asset_id || 'Asset'"
            class="ap-object-cover"
        />
      </a>
    </div>
    <div  class="ap-mt-6 ap-flex ap-flex-col ap-justify-between">
      <div class="ap-flex ap-items-center">
    <span class="ap-text-3xl ap-font-extrabold ap-tracking-tight">
      <count-up :end-val="listingParams.auction_start_price?.toString() || 0" :decimalPlaces="2" :duration="1"></count-up>
    </span>
        <span class="ap-ms-1 ap-text-xl ap-font-normal ap-text-gray-500 dark:ap-text-gray-400 ap-uppercase">{{ listingParams.currency_name }}</span>
      </div>
      <div v-if="listingParams.status === 'active'" class="ap-flex ap-items-center">
        <NumberField
            id="priceMin"
            :model-value="price"
            :format-options="{
              style: 'decimal',
              minimumFractionDigits: 2
          }"
            :min="listingParams.auction_start_price"
            @update:modelValue="(value: number) => price = value"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput class="ap-text-lg ap-font-bold ap-h-10"/>
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <Button variant="default" size="lg" class="ap-w-20 ap-h-10 ap-ml-2" @click="emit('action:buy', price)">Bid</Button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>