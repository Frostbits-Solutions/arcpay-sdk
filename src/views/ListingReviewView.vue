<script setup lang="ts">
import { computed, inject } from 'vue'
import CountUp from 'vue-countup-v3'
import type { ListingParams } from '@/lib/app/reviewListing'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-vue-next'
import ListingStatusChip from "@/components/ListingReview/ListingStatusChip.vue";

interface ListingReviewProvider {
  callback: (price: number, error?: Error) => void
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
    <div class="ap-w-full ap-flex ap-justify-between ap-items-center ap-pt-1.5 ap-pr-10 ap-pl-4 ap-mb-2">
      <div class="ap-flex ap-items-baseline ap-text-gray-900 dark:ap-text-white">
        <span class="ap-text-3xl ap-font-extrabold ap-tracking-tight"><count-up :end-val="listingParams.asking_price?.toString() || 999" :decimalPlaces="2" :duration="1"></count-up></span>
        <span
          class="ap-ms-1 ap-text-xl ap-font-normal ap-text-gray-500 dark:ap-text-gray-400">{{ listingParams.listing_currency !== '0' ? `ARC200(${listingParams.listing_currency})` : 'VOI' }}</span>
      </div>
      <ListingStatusChip :listing-params="listingParams"/>
    </div>
    <a
      :href="nftNavigatorLink"
      target="_blank"
      class="ap-max-w-[375px] ap-max-h-[375px] table ap-relative ap-rounded-2xl ap-overflow-hidden ap-shadow-xl hover:ap-shadow-2xl ap-transition ap-border ap-border-border">
      <img
        v-if="listingParams.asset_thumbnail"
        :src="listingParams.asset_thumbnail"
        :alt="listingParams.asset_id || 'Asset'"
        class="ap-w-auto ap-h-auto ap-object-cover"
      />
    </a>
    <div class="ap-flex ap-justify-center ap-items-center ap-w-full ap-mt-6">
      <button class="animated-button hover:ap-shadow-[#e99796] hover:ap-shadow-2xl" @click="callback(listingParams?.asking_price || 1)" v-if="listingParams.status === 'active'">
        <ArrowRight class="ap-w-6 ap-h-6 arr-2"/>
        <span class="text">Buy {{listingParams.listing_name}}</span>
        <span class="circle"></span>
        <ArrowRight class="ap-w-6 ap-h-6 arr-1"/>
      </button>
    </div>
  </div>
</template>

<style scoped>
.animated-button {
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

.animated-button svg {
  position: absolute;
  width: 24px;
  z-index: 9;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  color: hsla(var(--muted-foreground)/0.7);
}

.animated-button .arr-1 {
  right: 16px;
}

.animated-button .arr-2 {
  left: -25%;
}

.animated-button .circle {
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

.animated-button .text {
  position: relative;
  z-index: 1;
  transform: translateX(-12px);
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  max-width: 220px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.animated-button:hover {
  box-shadow: 0 0 0 12px transparent;
  color: #fff;
  transform: scale(1.1);
}

.animated-button:hover .arr-1 {
  right: -25%;
}

.animated-button:hover .arr-2 {
  left: 16px;
}

.animated-button:hover .text {
  transform: translateX(12px);
}

.animated-button:hover svg {
  color: #fff;
}

.animated-button:active {
  scale: 0.95;
  box-shadow: 0 0 0 4px hsl(var(--primary));
}

.animated-button:hover .circle {
  opacity: 1;
  width: 100%;
  padding-top: 100%;
}
</style>