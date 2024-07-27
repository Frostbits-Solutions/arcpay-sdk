<script setup lang="ts">
import { useArcpay } from '@/main'
import { Button } from '@/components/ui/button'

const arcpay = useArcpay({
  network: 'voi:testnet',
  apiKey: 'test',
  darkMode: true
})

function createListing() {
  arcpay.createListing({accountId: 0, assetId:'29105406/583'}).then(() => {
    console.log('Listing created')
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