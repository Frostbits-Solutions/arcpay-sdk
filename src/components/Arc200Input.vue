<template>
<div class="arc200-input-container">
  <template v-if="nfts.length > 0">
    <TextInput
      label="Search Arc200"
      placeholder="id or name"
      v-model="searchString"
    />
    <ul>
      <li
        v-for="nft of displayedNFTS"
        @click="() => selectNFT(nft)"
        :key="nft.contractId"
        @class="props.modelValue === nft.contractId ? 'selected' : ''"
      >
        <span><b>{{nft.name}}</b></span>
        <span>{{nft.contractId}}</span>
      </li>
    </ul>
  </template>
  <template v-else-if="error">
    {{error}}
  </template>
  <template v-else>
    <span>Fetching ARC200 NFTs...</span>
  </template>
</div>
</template>

<script setup lang="ts">
import type {Ref} from 'vue'
import {computed, onMounted, ref} from 'vue'
import {useWalletStore} from '@/stores/walletStore'
import TextInput from "@/components/TextInput.vue";

const props = defineProps<{
  modelValue: String,
}>()
const emit = defineEmits(['update:modelValue'])

const walletStore = useWalletStore()

const loaded = ref(false)
const error: Ref<null|String> = ref(null)
const nfts = ref([])
const searchString = ref('')

const displayedNFTS = computed (() => {
  if (searchString.value.length > 0)
    return nfts.value.filter(nft => {
      return nft.contractId.toString().includes(searchString.value) ||
      nft.name.toLowerCase().includes(searchString.value.toLowerCase())}
    )
  else {
    return nfts.value
  }
})


async function getData() {
  const url = 'https://arc72-idx.nautilus.sh/nft-indexer/v1/arc200/tokens'
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
  console.log(nft)
  emit('update:modelValue', nft.contractId)
}

onMounted(getData)
</script>

<style scoped>
.arc200-input-container {
  width: 100%;
  box-sizing: border-box;
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
  grid-template-columns: auto 150px;
  grid-column-gap: 5px;
  text-align: left;
  margin-bottom: 10px;
}

li:hover {
  background: lightgrey;
  cursor: pointer;
}

li.selected {
  background: gray;
}
</style>
