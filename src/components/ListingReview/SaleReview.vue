<script lang="ts" setup>
import CountUp from "vue-countup-v3";
import type {ListingParams} from "@/lib/app/reviewListing";
import {ArrowRight, Users} from "lucide-vue-next";
import ListingStatusChip from "@/components/ListingReview/ListingStatusChip.vue";
import type {Database} from "@/lib/supabase/database.types";
import {ref, watch} from "vue";
import AssetThumbnail from "@/components/ListingReview/AssetThumbnail.vue";
import {formatPrice} from "@/lib/utils";

type Transaction = Database['public']['Tables']['transactions']['Row']

const props = defineProps<{ listingParams: ListingParams, previewLink: string, presence: number, txs: Transaction[] }>()
const emit = defineEmits<{
  'action:buy': [price: number]
}>()

const status = ref<typeof ListingStatusChip | undefined>()
const statusOverride = ref<string | undefined>()

watch(() => props.txs, (value) => {
    value.map(tx => {
        if (tx.type === 'create') statusOverride.value = 'active'
        if (tx.type === 'buy') statusOverride.value = 'closed'
        if (tx.type === 'close') statusOverride.value = 'closed'
        if (tx.type === 'cancel') statusOverride.value = 'cancelled'
    })
}, {deep: true})
</script>

<template>
  <div class="ap-w-full sm:ap-w-96">
    <h1 class="ap-text-2xl ap-text-foreground ap-mr-1 ap-truncate ap-max-w-72 ap-pl-2">
      {{ listingParams.name }}
    </h1>
    <div class="ap-flex ap-justify-between ap-items-center">
      <div class="ap-flex ap-items-center ap-gap-1 ap-mt-1">
          <ListingStatusChip ref="status" :listing-params="listingParams" :override="statusOverride"/>
        <div class="ap-text-xs ap-text-foreground ap-bg-background/70 ap-rounded-full ap-px-2.5 ap-py-1.5">
          {{ listingParams.type }}
        </div>
        <div class="ap-text-xs ap-text-foreground ap-bg-background/70 ap-rounded-full ap-px-2.5 ap-py-1.5">
          {{ listingParams.asset_type }}
        </div>
      </div>
      <div class="ap-flex ap-items-center ap-text-muted-foreground ap-text-sm">
        {{ presence }}
        <Users class="ap-w-4 ap-h-4 ap-text-muted-foreground ap-mx-1"/>
      </div>
    </div>
    <div class="ap-flex ap-justify-center ap-mt-10 ap-mb-16">
      <AssetThumbnail :listing-params="listingParams" :preview-link="previewLink"/>
    </div>
    <button v-if="status?.status === 'active'"
            class="animated-button hover:ap-shadow-[#e99796] hover:ap-shadow-2xl ap-mx-auto"
            @click="emit('action:buy', formatPrice(listingParams?.sale_price || undefined, listingParams.currency_decimals || undefined))"
            v-motion-slide-bottom
    >
      <ArrowRight class="ap-w-6 ap-h-6 arr-2"/>
      <span class="text ap-flex ap-items-center ap-gap-1">
        Pay
        <div class="ap-flex ap-items-center">
          <span class="ap-text-3xl ap-font-extrabold ap-tracking-tight">
            <count-up :decimalPlaces="2" :duration="1" :end-val="formatPrice(listingParams?.sale_price || undefined, listingParams.currency_decimals || undefined)"></count-up>
          </span>
          <span class="ap-ms-1 ap-text-xl ap-font-normal ap-uppercase ap-opacity-70">{{
              listingParams.currency_ticker
            }}</span>
      </div>
      </span>
      <span class="circle"></span>
      <ArrowRight class="ap-w-6 ap-h-6 arr-1"/>
    </button>
  </div>
</template>

<style scoped>

</style>