<script setup lang="ts">
import { useArcpay } from '@/main'
import { Button } from '@/components/ui/button'

const arcpay = useArcpay({
  network: 'voi:testnet',
  apiKey: import.meta.env.VITE_ARCPAY_API_KEY,
  darkMode: false
})

function createListing() {
  arcpay.create({accountId: 0, assetId:'29105406/583'}).then((data) => {
    console.log('Listing created', data)
  }).catch((error) => {
    console.error(error)
  })
}
</script>

<template>
  <Button @click="createListing" variant="default">createListing</Button>
  <Button @click="arcpay.toggleDarkMode()" variant="secondary">Toggle dark mode</Button>
</template>

<style scoped>

</style>