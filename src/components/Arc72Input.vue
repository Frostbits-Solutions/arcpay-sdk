<template>
<div class="arc72-input-container">
  <template v-if="nfts.length > 0">
    <TextInput
      label="Search Arc72"
      placeholder="id or name"
      v-model="searchString"
    />
    <ul>
      <li
        v-for="nft of displayedNFTS"
        @click="() => selectNFT(nft)"
        :key="nft.tokenId"
        @class="selectedNFT.tokenId === nft.tokenId ? 'selected' : ''"
      >
        <img :src="JSON.parse(nft.metadata).image">
        <span><b>{{JSON.parse(nft.metadata).name}}</b></span>
        <span>{{JSON.parse(nft.metadata).description.slice(0,25)}}...</span>
      </li>
    </ul>
  </template>
  <template v-else-if="error">
    {{error}}
  </template>
  <template v-else-if="loaded">
    <span>You do not have any ARC72 NFTs</span>
  </template>
  <template v-else>
    <span>Fetching you ARC72 NFTs...</span>
  </template>
</div>
</template>

<script setup lang="ts">
import type {Ref} from 'vue'
import {computed, onMounted, ref} from 'vue'
import {useWalletStore} from '@/stores/walletStore'
import TextInput from "@/components/TextInput.vue";

const emit = defineEmits(['input'])
const walletStore = useWalletStore()

const loaded = ref(false)
const error: Ref<null|String> = ref(null)
const nfts = ref([])
const searchString = ref('')
const selectedNFT = ref(null)

const displayedNFTS = computed (() => {
  if (searchString.value.length > 0)
    return nfts.value.filter(nft => {
      return nft.tokenId.toString().includes(searchString.value) ||
      nft.metadata.toLowerCase().includes(searchString.value.toLowerCase())}
    )
  else {
    return nfts.value
  }
})


async function getData() {
  const url = `https://arc72-idx.nftnavigator.xyz/nft-indexer/v1/tokens?owner=${walletStore.account.address}`
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    const json = await response.json()
    nfts.value = json.tokens
    loaded.value = true
  } catch (error) {
    console.error(error.message)
    error.value = error.message
  }
}

function selectNFT (nft) {
  selectedNFT.value = nft
  emit('input', {nftAppID: nft.contractId, nftID: nft.tokenId})
}

onMounted(getData)
</script>

<style scoped>
.arc72-input-container {
  width: 100%;
  box-sizing: border-box;
}

img {
  width: 50px;
  height: 50px;
  grid-area: img;
  object-fit: contain;
}

ul {
  box-sizing: border-box;
  max-height: 100px;
  overflow-y: scroll;
  border: 1px solid lightgrey;
  border-radius: 5px;
}

li {
  display: grid;
  grid-template-columns: 50px auto;
  grid-column-gap: 5px;
  grid-template-areas:
    'img name'
    'img description';
  text-align: left;
  margin-bottom: 10px;
}

li:hover {
  background: lightgrey;
}

li.selected {
  background: gray;
}
</style>
