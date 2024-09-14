<script lang="ts" setup>
import type {ListingParams} from "@/lib/app/reviewListing";
import {computed} from "vue";

const props = defineProps<{
    listingParams: ListingParams,
    override?: string
}>()

const status = computed(() => {
  if (props.override) return props.override
  if (props.listingParams.created_at && props.listingParams.auction_duration && props.listingParams.status && props.listingParams.status !== 'closed') {
    const now = Date.now()
    const endTime = new Date(props.listingParams.created_at).getTime() + new Date().getTimezoneOffset() * 60_000 + (props.listingParams.auction_duration * 3_600_000)
    return now < endTime ? props.listingParams.status : 'ended'
  }
  return props.listingParams.status || 'pending'
})

defineExpose({
  status
})
</script>

<template>
  <div>
        <span v-if="['pending'].includes(status)"
              class="ap-inline-flex ap-items-center ap-bg-gray-100 ap-text-gray-800 ap-text-xs ap-font-medium ap-px-2.5 ap-py-1.5 ap-rounded-full dark:ap-bg-gray-700 dark:ap-text-gray-300">
          <span class="ap-w-2 ap-h-2 ap-me-1 ap-bg-gray-500 ap-rounded-full"></span>
          {{ status }}
        </span>
    <span v-if="['active'].includes(status)"
          class="ap-inline-flex ap-items-center ap-bg-purple-100/60 ap-text-purple-800 ap-text-xs ap-font-medium ap-px-2.5 ap-py-1.5 ap-rounded-full dark:ap-bg-purple-900 dark:ap-text-purple-300 ap-relative">
      <span class="ap-w-2 ap-h-2 ap-me-1 ap-bg-purple-500 ap-rounded-full ap-animate-ping"></span>
      <span class="ap-w-1.5 ap-h-1.5 ap-ml-[1px] ap-bg-purple-500 ap-rounded-full ap-absolute"></span>
          {{ status }}
    </span>
    <span v-if="['closed', 'ended'].includes(status)"
          class="ap-inline-flex ap-items-center ap-bg-green-100 ap-text-green-800 ap-text-xs ap-font-medium ap-px-2.5 ap-py-1.5 ap-rounded-full dark:ap-bg-green-900 dark:ap-text-green-300">
          <span class="ap-w-2 ap-h-2 ap-me-1 ap-bg-green-500 ap-rounded-full"></span>
          {{ status }}
        </span>
    <span v-if="['cancelled'].includes(status)"
          class="ap-inline-flex ap-items-center ap-bg-red-100 ap-text-red-800 ap-text-xs ap-font-medium ap-px-2.5 ap-py-1.5 ap-rounded-full dark:ap-bg-red-900 dark:ap-text-red-300">
          <span class="ap-w-2 ap-h-2 ap-me-1 ap-bg-red-500 ap-rounded-full"></span>
          {{ status }}
        </span>
  </div>
</template>

<style scoped>

</style>