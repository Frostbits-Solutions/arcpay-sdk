<script lang="ts" setup>
import {useArcpay} from '@/main'
import {Button} from '@/components/ui/button'
import {ref} from 'vue'

const listingId = ref('')

const arcpay = useArcpay('algo:testnet')

function create() {
  arcpay.create({assetId: '29105406/583'}).then((data) => {
    console.log('Listing created', data)
  }).catch((error) => {
    console.error(error)
  })
}

function createOffchain() {
    arcpay.create({
        assetId: '123456',
        listingName: 'Test Listing Meow',
        thumbnailUrl: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        listingType: 'offchain'
    }).then((data) => {
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
        <Button variant="default" @click="createOffchain()">create offchain</Button>
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
