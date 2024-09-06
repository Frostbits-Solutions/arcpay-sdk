<script setup lang="ts">
import { useArcpay } from '@/main'
import { Button } from '@/components/ui/button'
import { ref } from 'vue'

const listingId = ref('')

const arcpay = useArcpay('algo:testnet')

function create() {
  arcpay.create({assetId:'29105406/583'}).then((data) => {
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

async function close () {

}

async function cancel () {

}

async function testAppCall () {
  arcpay.testAppCall({
    fromAddress: "",
    appIndex: 0,
    appName: '',
    args: [],
    accounts: [],
    foreignApps: [],
    foreignAssets: []
  }).then((d) => console.log('app call ok:', d))
}

</script>

<template>
  <div>
    <div class="ap-flex ap-gap-4 ap-p-4">
      <Button @click="create" variant="default">create</Button>
      <Button @click="buy" variant="default">buy</Button>
      <Button @click="cancel" variant="default">cancel</Button>
      <Button @click="close" variant="default">close</Button>
      <Button @click="testAppCall" variant="default">test app call</Button>
      <input type="text" v-model="listingId" placeholder="listing id"/>
      <Button @click="arcpay.toggleDarkMode()" variant="secondary">toggle dark mode</Button>
    </div>
  </div>
</template>

<style scoped>

</style>
