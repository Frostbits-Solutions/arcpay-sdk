<script lang="ts" setup>
import {useArcpay} from '@/main'
import {Button} from '@/components/ui/button'
import {ref} from 'vue'

const listingId = ref('')

const arcpay = useArcpay('voi:testnet')

function create() {
  arcpay.create({assetId: '29105406/583'}).then((data) => {
    console.log('Listing created', data)
  }).catch((error) => {
    console.error(error)
  })
}

function buy() {
  if (listingId.value) {
    arcpay.buy(listingId.value).then((data) => {
      console.log('Listing bought', data)
    }).catch((error) => {
      console.error(error)
    })
  }
}

async function close() {
  if (listingId.value) {
    arcpay.close(listingId.value).then((data) => {
      console.log('Listing closed', data)
    }).catch((error) => {
      console.error(error)
    })
  }
}

async function cancel() {
  if (listingId.value) {
    arcpay.cancel(listingId.value).then((data) => {
      console.log('Listing cancelled', data)
    }).catch((error) => {
      console.error(error)
    })
  }
}

</script>

<template>
  <div>
    <div class="ap-flex ap-gap-4 ap-p-4">
      <Button variant="default" @click="create">create</Button>
      <Button variant="default" @click="buy">buy</Button>
      <Button variant="default" @click="cancel">cancel</Button>
      <Button variant="default" @click="close">close</Button>
      <input v-model="listingId" placeholder="listing id" type="text"/>
      <Button variant="secondary" @click="arcpay.toggleDarkMode()">toggle dark mode</Button>
    </div>
  </div>
</template>

<style scoped>

</style>
