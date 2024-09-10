<script lang="ts" setup>
import {computed, inject, onBeforeUnmount, onMounted, ref} from 'vue'
import type {ListingParams} from '@/lib/app/reviewListing'
import {useRouter} from "vue-router";
import {subscribeToAppTransactions} from "@/lib/supabase/transaction";
import type {RealtimeChannel, SupabaseClient} from "@supabase/supabase-js";
import type {Database} from "@/lib/supabase/database.types";

type Transaction = Database['public']['Tables']['transactions']['Row']

interface ListingReviewProvider {
  callback: (price: number, error?: Error) => void
  args: {
    listingParams: ListingParams
  }
}

const client = inject<SupabaseClient>('supabase')
const {callback, args} = inject<{ ListingReview: ListingReviewProvider }>('appProvider')?.['ListingReview'] || {}
const listingParams = args?.listingParams
const router = useRouter()
const realtimeChannel = ref<RealtimeChannel>()
const presenceTracker = ref<number>(0)
const transactionsTracker = ref<Transaction[]>([])

const nftNavigatorLink = computed(() => {
  if (listingParams && listingParams.asset_id?.split('/')?.[1]) {
    return `https://nftnavigator.xyz/collection/${listingParams.asset_id.split('/')[0]}/token/${listingParams.asset_id.split('/')[1]}`
  } else {
    return '#'
  }
})

function handleBuy(price: number) {
  if (callback) {
    callback(price)
  }
}

onMounted(() => {
  if (listingParams?.type === 'sale') router.push({name: 'sale-review'})
  if (listingParams?.type === 'auction') router.push({name: 'auction-review'})
  if (listingParams?.type === 'dutch') router.push({name: 'dutch-review'})
  if (client && listingParams?.app_id) {
    realtimeChannel.value = subscribeToAppTransactions(client, listingParams.app_id, (newTx) => {
      transactionsTracker.value.push(newTx.new as Transaction)
    }, (count) => {
      presenceTracker.value = count
    })
  }
});

onBeforeUnmount(() => {
  if (realtimeChannel.value) {
    realtimeChannel.value.unsubscribe()
  }
})
</script>

<template>
  <div v-if="listingParams" id="review-settings">
    <router-view :listing-params="listingParams" :presence="presenceTracker" :previewLink="nftNavigatorLink"
                 :txs="transactionsTracker" @action:buy="(price: number) => handleBuy(price)"/>
  </div>
</template>

<style scoped>
#review-settings:deep(.animated-button) {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 14px 32px;
  border: 4px solid transparent;
  font-size: 12px;
  background-color: inherit;
  border-radius: 100px;
  font-weight: 600;
  box-shadow: 0 0 0 2px hsla(var(--muted-foreground)/0.1);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  color: hsla(var(--muted-foreground)/0.7);
}

#review-settings:deep(.animated-button svg) {
  position: absolute;
  width: 24px;
  z-index: 9;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  color: hsla(var(--muted-foreground)/0.7);
}

#review-settings:deep(.animated-button .arr-1) {
  right: 16px;
}

#review-settings:deep(.animated-button .arr-2) {
  left: -25%;
}

#review-settings:deep(.animated-button .circle) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: var(--gradient);
  border-radius: 50%;
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

#review-settings:deep(.animated-button .text) {
  position: relative;
  z-index: 1;
  transform: translateX(-12px);
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  max-width: 220px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

#review-settings:deep(.animated-button:hover) {
  box-shadow: 0 0 0 12px transparent;
  color: #fff;
  transform: scale(1.1);
}

#review-settings:deep(.animated-button:hover .arr-1) {
  right: -25%;
}

#review-settings:deep(.animated-button:hover .arr-2) {
  left: 16px;
}

#review-settings:deep(.animated-button:hover .text) {
  transform: translateX(12px);
}

#review-settings:deep(.animated-button:hover svg) {
  color: #fff;
}

#review-settings:deep(.animated-button:active) {
  scale: 0.95;
  box-shadow: 0 0 0 4px hsl(var(--border));
}

#review-settings:deep(.animated-button:hover .circle) {
  opacity: 1;
  width: 100%;
  padding-top: 100%;
}
</style>