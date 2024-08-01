<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import CountUp from 'vue-countup-v3'
import type { ListingParams } from '@/lib/app/reviewListing'
import { Button } from '@/components/ui/button'

interface ListingReviewProvider {
  callback: () => void
  args: {
    listingParams: ListingParams
  }
}

const { callback, args } = inject<{ ListingReview: ListingReviewProvider }>('appProvider')?.['ListingReview'] || {}
const listingParams = args?.listingParams
const nftNavigatorLink = computed(() => {
  if(listingParams && listingParams.asset_id?.split('/')?.[1]) {
    return `https://nftnavigator.xyz/collection/${listingParams.asset_id.split('/')[0]}/token/${listingParams.asset_id.split('/')[1]}`
  } else {
    return '#'
  }
})


</script>

<template>
  <div class="ap-flex ap-flex-col ap-justify-start ap-gap-4 ap-items-center" v-if="listingParams">
    <h1 class="ap-text-muted-foreground/50 ap-pt-2 ap-pl-4 ap-pr-10 ap-text-left ap-w-full ap-truncate">{{listingParams.listing_name}}</h1>
    <a
      :href="nftNavigatorLink"
      target="_blank"
      class="ap-w-[333px] ap-h-[333px] ap-flex ap-items-end ap-relative ap-rounded-2xl ap-overflow-hidden ap-shadow-2xl ap-border ap-border-border ap-animate-in ap-slide-in-from-bottom-2 ap-fade-in ap-delay-75 ap-fill-mode-both">
      <img
        v-if="listingParams.asset_thumbnail"
        :src="listingParams.asset_thumbnail"
        :alt="listingParams.asset_id || 'Asset'"
        class="ap-w-[333px] ap-h-[333px] ap-object-cover ap-absolute ap-top-0 ap-left-0 ap-z-0"
      />
    </a>
    <div class="ap-flex ap-justify-between ap-items-center ap-w-full ap-px-4">
      <div class="ap-flex ap-items-baseline ap-text-gray-900 dark:ap-text-white">
        <span class="ap-text-3xl ap-font-extrabold ap-tracking-tight"><count-up :end-val="listingParams.asking_price?.toString() || 999" :decimalPlaces="2" :duration="1"></count-up></span>
        <span
          class="ap-ms-1 ap-text-xl ap-font-normal ap-text-gray-500 dark:ap-text-gray-400">{{ listingParams.listing_currency !== '0' ? `ARC200(${listingParams.listing_currency})` : 'VOI' }}</span>
      </div>
      <div>
        <span v-if="['pending'].includes(listingParams.status || '')"
              class="ap-inline-flex ap-items-center ap-bg-gray-100 ap-text-gray-800 ap-text-xs ap-font-medium ap-px-2.5 ap-py-1.5 ap-rounded-full dark:ap-bg-gray-700 dark:ap-text-gray-300">
          <span class="ap-w-2 ap-h-2 ap-me-1 ap-bg-gray-500 ap-rounded-full"></span>
          {{ listingParams.status }}
        </span>
        <span v-if="['active'].includes(listingParams.status || '')"
              class="ap-inline-flex ap-items-center ap-bg-purple-100 ap-text-purple-800 ap-text-xs ap-font-medium ap-px-2.5 ap-py-1.5 ap-rounded-full dark:ap-bg-purple-900 dark:ap-text-purple-300">
          <span class="ap-w-2 ap-h-2 ap-me-1 ap-bg-purple-500 ap-rounded-full"></span>
          {{ listingParams.status }}
        </span>
        <span v-if="['closed'].includes(listingParams.status || '')"
              class="ap-inline-flex ap-items-center ap-bg-green-100 ap-text-green-800 ap-text-xs ap-font-medium ap-px-2.5 ap-py-1.5 ap-rounded-full dark:ap-bg-green-900 dark:ap-text-green-300">
          <span class="ap-w-2 ap-h-2 ap-me-1 ap-bg-green-500 ap-rounded-full"></span>
          {{ listingParams.status }}
        </span>
        <span v-if="['cancelled'].includes(listingParams.status || '')"
              class="ap-inline-flex ap-items-center ap-bg-red-100 ap-text-red-800 ap-text-xs ap-font-medium ap-px-2.5 ap-py-1.5 ap-rounded-full dark:ap-bg-red-900 dark:ap-text-red-300">
          <span class="ap-w-2 ap-h-2 ap-me-1 ap-bg-red-500 ap-rounded-full"></span>
          {{ listingParams.status }}
        </span>
      </div>
    </div>
    <Button variant="default" class="ap-w-[175px] ap-mt-8 ap-h-12 ap-rounded-xl ap-text-lg ap-shadow btn-grad" @click="callback" v-if="listingParams.status === 'active'">Buy</Button>
  </div>
</template>

<style scoped>
.btn-grad {
  background-image: linear-gradient(to right, #00c6ff 0%, #0072ff  51%, #00c6ff  100%);
  transition: 0.5s;
  background-size: 200% auto;
  color: #fff;
  background-position: right center;
}

.btn-grad:hover {
  background-position: left center; /* change the direction of the change here */
  text-decoration: none;
}
</style>