<script lang="ts" setup>
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
import {ArrowRight, LoaderCircle, Users, Crown} from "lucide-vue-next";
import type {Database} from "@/lib/supabase/database.types";
import {getTransactions} from "@/lib/supabase/transaction";
import type {SupabaseClient} from "@supabase/supabase-js";
import {formatAmountFromDecimals, formatPrice, getShortAddress} from "@/lib/utils";
import Jazzicon from "@/components/Jazzicon.vue";
import {ScrollArea} from "@/components/ui/scroll-area";
import AssetThumbnail from "@/components/ListingReview/AssetThumbnail.vue";

type Transaction = Database['public']['Tables']['transactions']['Row']

const client = inject<SupabaseClient>('supabase')
const props = defineProps<{ listingParams: ListingParams, previewLink: string, presence: number, txs: Transaction[] }>()
const emit = defineEmits<{ 'action:buy': [price: number] }>()
const bid = ref<number>(props.listingParams.auction_start_price || 1)
const minbid = ref<number>(props.listingParams.auction_start_price || 1)
const transactions = ref<Transaction[]>([])
const status = ref<typeof ListingStatusChip | undefined>()
const statusOverride = ref<string | undefined>()

const bids = computed(() => {
    return transactions.value.filter(tx => tx.type === 'bid').sort((a, b) => (b.amount || 0) - (a.amount || 0))
})

const highestBid = computed(() => {
    return formatAmount(bids.value[0]?.amount) || 0
})

function formatAmount(amount: number | null | undefined) {
    if (!amount) return 0
    if (props.listingParams.currency_decimals === null) return amount
    return parseFloat(formatAmountFromDecimals(amount, props.listingParams.currency_decimals).toFixed(2))
}

watch(() => highestBid.value, (value) => {
    minbid.value = bid.value = value + (props.listingParams.auction_increment || 1)
})

watch(() => props.txs, (value) => {
    transactions.value.splice(transactions.value.length - (value.length - 1), value.length, ...value)
    value.map(tx => {
        if (tx.type === 'create') statusOverride.value = 'active'
        if (tx.type === 'close') statusOverride.value = 'closed'
        if (tx.type === 'cancel') statusOverride.value = 'cancelled'
    })
}, {deep: true})

onMounted(async () => {
    if (client && props.listingParams.app_id) {
        const {data, error} = await getTransactions(client, props.listingParams.app_id)
        if (data) {
            transactions.value = data
            if (bids.value.length) {
                minbid.value = bid.value = highestBid.value + (props.listingParams.auction_increment || 1)
            }
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
                <ListingStatusChip ref="status" :listing-params="listingParams" :override="statusOverride"/>
                <div class="ap-text-xs ap-text-foreground ap-bg-background/70 ap-rounded-full ap-px-2.5 ap-py-1.5">
                    {{ listingParams.type }}
                </div>
                <div class="ap-text-xs ap-text-foreground ap-bg-background/70 ap-rounded-full ap-px-2.5 ap-py-1.5">
                    {{ listingParams.asset_type }}
                </div>
            </div>
            <div class="ap-flex ap-items-center ap-text-muted-foreground ap-text-sm ap-mr-1">
                {{ presence }}
                <Users class="ap-w-4 ap-h-4 ap-text-muted-foreground ap-mx-1"/>
            </div>
        </div>
    </div>
    <div
            class="ap-mt-6 ap-flex ap-flex-col ap-justify-between ap-items-center sm:ap-flex-row sm:ap-items-stretch ap-mb-10 ap-gap-4">
        <div class="ap-flex ap-items-center">
            <AssetThumbnail :listing-params="listingParams" :preview-link="previewLink"/>
        </div>
        <div class="ap-mt-2 ap-w-72">
            <div class="ap-flex ap-items-baseline ap-justify-between ap-px-2">
                <span class="ap-text-muted-foreground ap-text-sm">History</span>
            </div>
            <ScrollArea class="ap-h-[136px] ap-px-2 ap-py-1 ap-mb-2">
                <ol v-if="bids.length" class="ap-ml-4 ap-border-l-2 ap-border-border">
                    <li v-for="(tx, index) in bids" :key="tx.id" class="ap-py-2 ap-flex ap-items-center ap-justify-between -ap-ml-[11px] ap-mr-0.5" v-motion-fade-visible-once>
                        <div class="ap-flex ap-items-center ap-w-full ap-text-xs ap-font-semibold ap-gap-2">
                            <Jazzicon :address="`0x${tx.from_address}`" :diameter="20"
                                      class="ap-w-[20px] ap-h-[20px] ap-shadow ap-rounded-full"/>
                            <div class="ap-truncate ap-text-muted-foreground">
                                <div class="ap-text-xs ap-font-bold">{{ getShortAddress(tx.from_address) }}</div>
                            </div>
                            <Crown v-if="!index" class="ap-w-4 ap-h-4 ap-text-muted-foreground/50"/>
                        </div>
                        <div class="ap-shrink-0">
                            <span class="ap-font-bold ap-mr-0.5">{{ formatAmount(tx.amount) }}</span>
                            <span
                                class="ap-uppercase ap-text-muted-foreground ap-text-xs">
                                {{ listingParams.currency_ticker }}
                            </span>
                        </div>
                    </li>
                </ol>
                <div v-else
                     class="ap-h-[120px] ap-text-md ap-text-muted-foreground/50 ap-text-center ap-flex ap-items-center ap-justify-center ap-gap-1">
                    <LoaderCircle class="ap-w-5 ap-h-5 ap-text-muted-foreground/50 ap-animate-spin"/>
                    No bids yet
                </div>
            </ScrollArea>
            <div v-if="status?.status === 'active'">
                <span class="ap-text-muted-foreground ap-text-sm">Your bid</span>
                <NumberField
                        id="bidMin"
                        :format-options="{
                          style: 'decimal',
                          minimumFractionDigits: 2
                        }"
                        :min="minbid"
                        :model-value="bid"
                        @update:modelValue="(value: number) => bid = value">
                    <NumberFieldContent>
                        <NumberFieldDecrement/>
                        <NumberFieldInput class="ap-text-lg ap-font-bold ap-h-10"/>
                        <NumberFieldIncrement/>
                    </NumberFieldContent>
                </NumberField>
            </div>
        </div>
    </div>
    <button v-if="status?.status === 'active'"
            class="animated-button hover:ap-shadow-[#e99796] hover:ap-shadow-2xl ap-mx-auto"
            @click="emit('action:buy', formatPrice(bid, listingParams.currency_decimals || undefined))"
            v-motion-slide-bottom
    >
        <ArrowRight class="ap-w-6 ap-h-6 arr-2"/>
        <span class="text ap-flex ap-items-center ap-gap-1">
            Bid
            <div class="ap-flex ap-items-center">
              <span class="ap-text-3xl ap-font-extrabold ap-tracking-tight">
                <count-up :decimalPlaces="2" :duration="1" :end-val="formatPrice(bid, listingParams.currency_decimals || undefined)"></count-up>
              </span>
              <span class="ap-ms-1 ap-text-xl ap-font-normal ap-uppercase ap-opacity-70">
                  {{ listingParams.currency_ticker }}
              </span>
            </div>
          </span>
        <span class="circle"></span>
        <ArrowRight class="ap-w-6 ap-h-6 arr-1"/>
    </button>
    <button v-if="status?.status === 'ended'"
            class="animated-button hover:ap-shadow-[#e99796] hover:ap-shadow-2xl ap-mx-auto"
            @click="emit('action:buy', -1)"
            v-motion-slide-bottom
    >
        <ArrowRight class="ap-w-6 ap-h-6 arr-2"/>
        <span class="text ap-flex ap-items-center ap-gap-1">
            <span class="ap-text-lg ap-tracking-tight">
                Close auction
            </span>
      </span>
      <span class="circle"></span>
      <ArrowRight class="ap-w-6 ap-h-6 arr-1"/>
    </button>
</template>

<style scoped>

</style>