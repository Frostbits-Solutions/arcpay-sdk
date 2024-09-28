<script lang="ts" setup>
import type {CreateListingOptions, ListingCreationParams} from '@/lib/app'
import {inject, onMounted} from 'vue'
import type {WalletAccount} from "@txnlab/use-wallet";
import router from '@/router'

interface ListingCreationProvider {
  args: {
    account: WalletAccount,
    options: CreateListingOptions
  },
  callback: ((params: ListingCreationParams) => void)
}

const {args, callback} = inject<{ ListingCreation: ListingCreationProvider }>('appProvider')?.['ListingCreation'] || {}

function createListing(params: ListingCreationParams) {
  if (params && callback) {
    callback(params)
  }
}

onMounted(() => {
  if (args?.options?.listingType) {
    router.push({name: `${args.options.listingType}-creation`})
  }
})
</script>

<template>
    <router-view @action:create-listing="(params: ListingCreationParams) => createListing(params)" :args="args" />
</template>

<style scoped>

</style>