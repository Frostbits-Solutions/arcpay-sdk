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
import {computed, inject, onMounted, ref, watch} from "vue";
import ListingStatusChip from "@/components/ListingReview/ListingStatusChip.vue";
import {ArrowRight, LoaderCircle} from "lucide-vue-next";
import type {Database} from "@/lib/supabase/database.types";
import {getTransactions} from "@/lib/supabase/transaction";
import type {SupabaseClient} from "@supabase/supabase-js";
import {getShortAddress} from "@/lib/utils";
import Jazzicon from "@/components/Jazzicon.vue";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Users} from "lucide-vue-next";

type Transaction = Database['public']['Tables']['transactions']['Row']

const client = inject<SupabaseClient>('supabase')
const props = defineProps<{listingParams: ListingParams, previewLink: string, presence: number}>()
const emit = defineEmits<{ 'action:buy': [price: number] }>()
const price = ref<number>(props.listingParams.auction_start_price || 1)
const minPrice = ref<number>(props.listingParams.auction_start_price || 1)
const transactions = ref<Transaction[]>([])
const bids = computed(() => {
  return transactions.value.filter(tx => tx.type === 'bid').sort((a, b) => (b.amount || 0) - (a.amount || 0))
})

const highestBid = computed(() => {
  return formatAmount(bids.value[0]?.amount) || props.listingParams.auction_start_price || 1
})

function formatAmount(amount: number | null | undefined) {
  if (!amount) return 0
  return amount / 1_000_000
}

watch(() => highestBid.value, (value) => {
  minPrice.value = price.value = value + (props.listingParams.auction_increment || 1)
})

onMounted(async () => {
  if (client && props.listingParams.app_id) {
    const {data, error} = await getTransactions(client, props.listingParams.app_id)
    if (data) {
      transactions.value = data
    } else {
      console.error(error)
    }
  }
})
</script>

<template>
  <div class="ap-w-full sm:ap-w-[590px]">
    <h1 class="ap-text-2xl ap-text-foreground ap-mr-1 ap-truncate ap-max-w-72 ap-pl-2">
      {{ listingParams.name }}
    </h1>
    <div class="ap-flex ap-justify-between ap-items-center">
      <div class="ap-flex ap-items-center ap-gap-1 ap-mt-1">
        <ListingStatusChip :listing-params="listingParams"/>
        <div class="ap-text-xs ap-text-foreground ap-bg-background/70 ap-rounded-full ap-px-2.5 ap-py-1.5">{{listingParams.type}}</div>
        <div class="ap-text-xs ap-text-foreground ap-bg-background/70 ap-rounded-full ap-px-2.5 ap-py-1.5">{{listingParams.asset_type}}</div>
      </div>
      <div class="ap-flex ap-items-center ap-text-muted-foreground ap-text-sm">
        {{ presence}}
        <Users class="ap-w-4 ap-h-4 ap-text-muted-foreground ap-mx-1"/>
      </div>
    </div>
  </div>
  <div class="ap-mt-6 ap-flex ap-flex-col ap-justify-between ap-items-center sm:ap-flex-row sm:ap-items-stretch ap-mb-10 ap-gap-4">
    <div class="ap-flex ap-items-center">
      <a :href="previewLink"
         target="_blank"
         class="ap-block ap-max-w-[275px] ap-max-h-[275px] ap-relative ap-rounded-2xl ap-overflow-hidden ap-shadow-2xl ap-border ap-border-border">
        <img
            v-if="listingParams.asset_thumbnail"
            :src="listingParams.asset_thumbnail"
            :alt="listingParams.asset_id || 'Asset'"
            class="ap-object-cover"
        />
      </a>
    </div>
    <div class="ap-mt-2 ap-w-72">
      <div class="ap-flex ap-items-baseline ap-justify-between ap-px-2">
        <span class="ap-text-muted-foreground ap-text-sm">Latest bids:</span>
        <div class="ap-flex ap-items-center">
          <span class="ap-text-3xl ap-font-extrabold ap-tracking-tight">
            <count-up :end-val="highestBid?.toString()" :decimalPlaces="2" :duration="1"></count-up>
          </span>
          <span class="ap-ms-1 ap-text-xl ap-font-normal ap-text-gray-500 dark:ap-text-gray-400 ap-uppercase">{{ listingParams.currency_ticker }}</span>
        </div>
      </div>
      <ScrollArea class="ap-h-[136px] ap-bg-background/50 ap-rounded-md ap-p-2 ap-mt-1 ap-mb-2">
        <ol v-if="bids.length">
          <li v-for="tx in bids" :key="tx.id" class="ap-w-full ap-p-2 ap-flex ap-items-center ap-justify-between">
            <div class="ap-flex ap-items-center ap-w-full ap-text-xs ap-font-semibold">
              <Jazzicon :address="`0x${tx.from_address}`" :diameter="20" class="ap-w-[20px] ap-h-[20px] ap-mr-2 ap-shadow ap-rounded-full" />
              <div class="ap-truncate ap-text-muted-foreground">
                <div class="ap-text-xs ap-font-bold">{{ getShortAddress(tx.from_address) }}</div>
              </div>
            </div>
            <div class="ap-shrink-0">
              <span class="ap-font-bold ap-mr-0.5">{{ formatAmount(tx.amount).toFixed(2) }}</span><span class="ap-uppercase ap-text-muted-foreground ap-text-xs">{{ listingParams.currency_ticker }}</span>
            </div>
          </li>
        </ol>
        <div v-else class="ap-h-[120px] ap-text-md ap-text-muted-foreground/50 ap-text-center ap-flex ap-items-center ap-justify-center ap-gap-1">
          <LoaderCircle class="ap-w-5 ap-h-5 ap-text-muted-foreground/50 ap-animate-spin"/>
          No bids yet
        </div>
      </ScrollArea>
      <div v-if="listingParams.status === 'active'">
        <span class="ap-text-muted-foreground ap-text-sm">Your bid:</span>
        <NumberField
            id="priceMin"
            :model-value="price"
            :format-options="{
              style: 'decimal',
              minimumFractionDigits: 2
            }"
            :min="minPrice"
            @update:modelValue="(value: number) => price = value"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput class="ap-text-lg ap-font-bold ap-h-10"/>
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>
    </div>
  </div>
  <button class="animated-button hover:ap-shadow-[#e99796] hover:ap-shadow-2xl ap-mx-auto" @click="emit('action:buy', parseFloat(price.toFixed(2)))">
    <ArrowRight class="ap-w-6 ap-h-6 arr-2"/>
    <span class="text ap-flex ap-items-center ap-gap-1">
            Bid
            <div class="ap-flex ap-items-center">
              <span class="ap-text-3xl ap-font-extrabold ap-tracking-tight">
                <count-up :end-val="price" :decimalPlaces="2" :duration="1"></count-up>
              </span>
              <span class="ap-ms-1 ap-text-xl ap-font-normal ap-uppercase ap-opacity-70">{{ listingParams.currency_ticker }}</span>
            </div>
          </span>
    <span class="circle"></span>
    <ArrowRight class="ap-w-6 ap-h-6 arr-1"/>
  </button>
</template>

<style scoped>

</style>