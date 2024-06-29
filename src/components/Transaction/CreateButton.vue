<template>
  <h2>Contract information</h2>
  <SelectInput
    :model-value="transactionStore.contractType"
    @update:model-value="(d) => transactionStore.contractType = Number(d)"
    label="Contract"
    :options="possibleContract"/>

  <SelectInput
    v-model="currency_type"
    @update:model-value="updateConvention"
    label="Currency type"
    :options="[
      {name: 'Voi', value: CURRENCY_TYPE.VOI},
      {name: 'ARC200', value: CURRENCY_TYPE.ARC200},
    ]"/>

  <IntInput
    label="Arc200 appID"
    v-model="parameterStore.arc200AppID"
    v-if="transactionStore.conventionType === CONVENTION_TYPE.Arc200Arc72 ||
    transactionStore.conventionType === CONVENTION_TYPE.Arc200Rwa"
  />

  <SelectInput
    v-model="selling_object_type"
    @update:model-value="updateConvention"
    label="Selling object type"
    :options="[
      {name: 'ARC72', value: SELLING_OBJECT_TYPE.ARC72},
      {name: 'RWA', value: SELLING_OBJECT_TYPE.RWA},
    ]"/>

  <br>

  <template
    v-if="transactionStore.conventionType === CONVENTION_TYPE.Arc200Arc72 ||
          transactionStore.conventionType ===CONVENTION_TYPE.VoiArc72">
    <h2>ARC 72 Token</h2>
    <div class="ap-grid ap-grid-cols-[150px_auto] ap-gap-x-4">
      <span class="ap-self-center ap-text-sm ap-font-medium ap-text-right ap-text-gray-900 dark:ap-text-white">Token id</span>
      <span class="ap-self-center ap-text-sm ap-font-medium ap-text-left ap-text-gray-900 dark:ap-text-white">
        <template v-if="parameterStore.nftID">
          {{parameterStore.nftID}}
        </template>
        <template v-else>
          Please, select a token below
        </template>
      </span>
    </div>

    <Arc72Input
      @input="(nft) => {
        parameterStore.nftID = nft.nftID
        parameterStore.nftAppID = nft.nftAppID
      }"
    />
  </template>


  <template
    v-if="transactionStore.contractType === CONTRACT_TYPE.Auction ||
          transactionStore.contractType === CONTRACT_TYPE.Dutch"
  >
    <h2>Auction information</h2>
    <IntInput v-model="parameterStore.priceMin" label="Minimum price"/>
    <IntInput v-model="parameterStore.priceMax" :min="parameterStore.priceMin + 1" label="Maximum price" v-if="transactionStore.contractType === CONTRACT_TYPE.Dutch"/>
    <IntInput v-model="parameterStore.duration" label="Duration (in hours)"/>
  </template>

  <template v-if="transactionStore.contractType === CONTRACT_TYPE.Sale">
    <template
      v-if="transactionStore.conventionType === CONVENTION_TYPE.VoiRwa ||
          transactionStore.conventionType ===CONVENTION_TYPE.Arc200Rwa">
      <h2>RWA information</h2>
      <TextInput
        v-model="parameterStore.rwaId"
        label="RWA ID"
      />
      <TextInput
        v-model="parameterStore.rwaName"
        label="RWA Name"
      />
    </template>
    <h2>Sale information</h2>
    <IntInput
      label="Sell price"
      v-model="parameterStore.price"/>
  </template>
  <button
    class="ap-flex ap-items-center ap-justify-center ap-rounded-lg ap-bg-blue-700 ap-px-5 ap-py-2.5 ap-text-center ap-text-sm ap-font-medium ap-text-white hover:ap-bg-blue-800 focus:ap-outline-none focus:ap-ring-4 focus:ap-ring-blue-300 dark:ap-bg-blue-600 dark:ap-hover:bg-blue-700 dark:focus:ap-ring-blue-800"
    @click="transactionStore.doTransaction()">Create</button>
</template>

<script lang="ts" setup>
import {useTransactionStore} from '@/stores/transactionStore'
import {useParametersStore} from '@/stores/parametersStore'
import IntInput from '@/components/IntInput.vue'
import {CONTRACT_TYPE, CONVENTION_TYPE, CURRENCY_TYPE, SELLING_OBJECT_TYPE} from '@/constants/index'
import TextInput from '@/components/TextInput.vue'
import {computed, ref} from 'vue'
import SelectInput from '@/components/SelectInput.vue'
import Arc72Input from "@/components/Arc72Input.vue";

const transactionStore = useTransactionStore()
const parameterStore = useParametersStore()

const currency_type = ref(CURRENCY_TYPE.VOI)
const selling_object_type = ref(SELLING_OBJECT_TYPE.ARC72)

const possibleContract = computed(() => {
  let t
  switch (transactionStore.conventionType) {
    case CONVENTION_TYPE.VoiArc72:
    case CONVENTION_TYPE.Arc200Arc72:
      t = [
        {name: 'Auction', value: CONTRACT_TYPE.Auction},
        {name: 'Dutch', value: CONTRACT_TYPE.Dutch},
        {name: 'Sale', value: CONTRACT_TYPE.Sale}]
      break
    case CONVENTION_TYPE.VoiRwa:
    case CONVENTION_TYPE.Arc200Rwa:
      t =  [
        {name: 'Sale', value: CONTRACT_TYPE.Sale}]
      break
  }
  return t
})

function updateConvention () {
  let convention
  switch (Number(currency_type.value)) {
    case CURRENCY_TYPE.ARC200:
      switch (Number(selling_object_type.value)) {
        case SELLING_OBJECT_TYPE.ARC72:
          convention = CONVENTION_TYPE.Arc200Arc72
          break
        case SELLING_OBJECT_TYPE.RWA:
          convention = CONVENTION_TYPE.Arc200Rwa
          break
      }
      break
    case CURRENCY_TYPE.VOI:
      switch (Number(selling_object_type.value)) {
        case SELLING_OBJECT_TYPE.ARC72:
          convention = CONVENTION_TYPE.VoiArc72
          break
        case SELLING_OBJECT_TYPE.RWA:
          convention = CONVENTION_TYPE.VoiRwa
          break
      }
  }
  console.log(transactionStore.conventionType, convention, currency_type.value, selling_object_type.value)
  transactionStore.conventionType = convention
  //@ts-ignore
  transactionStore.contractType = possibleContract.value[0].value
}
</script>

<style scoped>

</style>
