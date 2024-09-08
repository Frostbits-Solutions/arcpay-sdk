<script lang="ts" setup>
import type {ListingParams} from "@/lib/app/reviewListing";

defineProps<{
  listingParams: ListingParams
}>()
</script>

<template>
  <div>
        <span v-if="['pending'].includes(listingParams.status || '')"
              class="ap-inline-flex ap-items-center ap-bg-gray-100 ap-text-gray-800 ap-text-xs ap-font-medium ap-px-2.5 ap-py-1.5 ap-rounded-full dark:ap-bg-gray-700 dark:ap-text-gray-300">
          <span class="ap-w-2 ap-h-2 ap-me-1 ap-bg-gray-500 ap-rounded-full"></span>
          {{ listingParams.status }}
        </span>
    <span v-if="['active'].includes(listingParams.status || '')"
          class="ap-inline-flex ap-items-center ap-bg-purple-100/60 ap-text-purple-800 ap-text-xs ap-font-medium ap-px-2.5 ap-py-1.5 ap-rounded-full dark:ap-bg-purple-900 dark:ap-text-purple-300">
      <span class="ap-w-2 ap-h-2 ap-me-1 ap-bg-purple-500 ap-rounded-full ap-animate-ping"></span>
      <span class="ap-w-1.5 ap-h-1.5 ap-ml-[1px] ap-bg-purple-500 ap-rounded-full ap-absolute"></span>
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
</template>

<style scoped>

</style>