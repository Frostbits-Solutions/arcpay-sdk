<script setup lang="ts">
import { useArcpay } from '@/main'
import { Button } from '@/components/ui/button'
import {ref} from 'vue'

const listingId = ref('')

const arcpay = useArcpay('algo:testnet')

async function create() {
  console.log(arcpay)
  arcpay.create({accountId: 0, assetId:'29105406/583', listingType: 'sale'}).then((data) => {
    console.log('Listing created', data)
  }).catch((error) => {
    console.error(error)
  })
}

async function buy() {
  if (listingId.value) {
    arcpay.buy(listingId.value).then((data) => {
      console.log('Listing bought', data)
    }).catch((error) => {
      console.error(error)
    })
  }
}

async function close () {

}

async function cancel () {

}

</script>

<template>
  <div class="ap-w-[100dvw] ap-h-[100dvh]">
    <div class="ap-flex ap-gap-4 ap-p-4">
      <Button @click="create" variant="default">create</Button>
      <Button @click="buy" variant="default">buy</Button>
      <Button @click="cancel" variant="default">cancel</Button>
      <Button @click="close" variant="default">close</Button>
      <input type="text" v-model="listingId" placeholder="listing id"/>
      <Button @click="arcpay.toggleDarkMode()" variant="secondary">toggle dark mode</Button>
    </div>
  </div>
</template>

<style scoped>

</style>
