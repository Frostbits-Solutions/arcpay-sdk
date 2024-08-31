<script setup lang="ts">
import { useArcpay } from '@/main'
import { Button } from '@/components/ui/button'
import {inject, ref} from 'vue'
import {interfaces} from "@/lib/contracts/interfaces";
import {WalletId, WalletManager} from "@txnlab/use-wallet";
import {createApp} from "@/lib/contracts/createApp";
import {Algodv2, TransactionSigner} from "algosdk";

const listingId = ref('')

const arcpay = useArcpay('algo:testnet')

async function create() {
  // console.log(arcpay)
  // arcpay.create({accountId: 0, assetId:'29105406/583', listingType: 'sale'}).then((data) => {
  //   console.log('Listing created', data)
  // }).catch((error) => {
  //   console.error(error)
  // })

  const walletManager = arcpay.getWalletManager()
  const networksConfig = arcpay.getNetworkConfig()
  const client = arcpay.getClient()
  const appProvider = arcpay.getAppProvider()

  console.log('create')

  const peraWallet = walletManager.getWallet(WalletId.PERA)
  if(peraWallet?.isConnected){
    await peraWallet?.resumeSession()
  }
  await peraWallet?.connect()

  if (walletManager.activeAccount === null) {
    console.log('no active address')
    return
  }

  console.log(await createApp(networksConfig, appProvider, walletManager, client, 1, walletManager.activeAccount,  {
    type: 'dutch',
    asset: {
      id: "717821637",
      name: "tesrdtg",
      description: "",
      thumbnail: "ipfs://QmSEZswe5SKp7ftci3btZCL6R8fE2W7Nv1VmDyWzDfSAA3",
      type: 'ASA',
      thumbnailMIMEType: 'image/png',
      properties: { }
    },
    priceMin: 1,
    priceMax: 2,
    duration: 1000,
    currency: {
      chain: 'algo:testnet',
      type: 'ASA',
      created_at: '',
      id: '718663983',
      name: '',
      ticker: '',
      decimals: 1,
    }
  }))
}

async function buy() {
  // if (listingId.value) {
  //   arcpay.buy(listingId.value).then((data) => {
  //     console.log('Listing bought', data)
  //   }).catch((error) => {
  //     console.error(error)
  //   })
  // }
  const walletManager = arcpay.getWalletManager()

  const peraWallet = walletManager.getWallet(WalletId.PERA)
  if(peraWallet?.isConnected){
    await peraWallet?.resumeSession()
  }
  await peraWallet?.connect()

  if (walletManager.activeAddress === null) {
    console.log('no active address')
    return
  }

  const res = await interfaces["algo"]["ASA"]["ASA"]["dutch"].buy(
    walletManager.algodClient,
    walletManager.transactionSigner,
    walletManager.activeAddress,
    718663983, // ASAID
    1, // asa decimals
    717821637, //nftID: number, remove for bid
    718572552, //appIndex: number,
     "", //sellerAddress: string, remove for bid
    1, //price: number,
     "", //feesAppAddress: string, remove for bid
     0 //feesAppId: number   remove for bid
  )
  console.log(res)
}

async function close () {
  const walletManager = arcpay.getWalletManager()

  const peraWallet = walletManager.getWallet(WalletId.PERA)
  if(peraWallet?.isConnected){
    await peraWallet?.resumeSession()
  }
  await peraWallet?.connect()

  if (walletManager.activeAddress === null) {
    console.log('no active address')
    return
  }

  const res = await interfaces["common"].close(
    walletManager.algodClient,
    walletManager.transactionSigner,
    walletManager.activeAddress,
    718572552, //appIndex: number,
    "", //feesAppAddress: string,
    0 //feesAppId: number
  )

  console.log(res)
}

async function cancel () {
  const walletManager = arcpay.getWalletManager()

  const peraWallet = walletManager.getWallet(WalletId.PERA)
  if(peraWallet?.isConnected){
    await peraWallet?.resumeSession()
  }
  await peraWallet?.connect()

  if (walletManager.activeAddress === null) {
    console.log('no active address')
    return
  }

  const res = await interfaces["common"].cancel(
    walletManager.algodClient,
    walletManager.transactionSigner,
    walletManager.activeAddress,
    718572552, //appIndex: number
    0
  )

  console.log(res)
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
