<template>
  <SelectInput
    :model-value="transactionStore.conventionType"
    @update:model-value="(d) => transactionStore.conventionType = Number(d)"
    label="Convention"
    :options="[
      {name: 'Voi → Arc72', value: CONVENTION_TYPE.VoiArc72},
      {name: 'Voi → Rwa', value: CONVENTION_TYPE.VoiRwa},
      {name: 'Arc200 → Arc72', value: CONVENTION_TYPE.Arc200Arc72},
      {name: 'Arc200 → Rwa', value: CONVENTION_TYPE.Arc200Rwa},
    ]"/>

  <SelectInput
    :model-value="transactionStore.contractType"
    @update:model-value="(d) => transactionStore.contractType = Number(d)"
    label="Contract"
    :options="possibleContract"/>

  <!--
  <select
    class="ap-rounded-lg ap-border ap-border-gray-300 ap-bg-gray-50 ap-p-2.5 ap-text-sm ap-text-gray-900 focus:ap-border-blue-500 focus:ap-ring-blue-500 dark:ap-border-gray-500 dark:ap-bg-gray-600 dark:ap-text-white dark:ap-placeholder-gray-400"
    v-model="transactionStore.conventionType">
    <option :value="CONVENTION_TYPE.VoiArc72">Voi -> Arc72</option>
    <option :value="CONVENTION_TYPE.VoiRwa">Voi -> Rwa</option>
    <option :value="CONVENTION_TYPE.Arc200Arc72">Arc200 -> Arc72</option>
    <option :value="CONVENTION_TYPE.Arc200Rwa">Arc200 -> Rwa</option>
  </select>

  <select
    class="ap-rounded-lg ap-border ap-border-gray-300 ap-bg-gray-50 ap-p-2.5 ap-text-sm ap-text-gray-900 focus:ap-border-blue-500 focus:ap-ring-blue-500 dark:ap-border-gray-500 dark:ap-bg-gray-600 dark:ap-text-white dark:ap-placeholder-gray-400"
    v-model="transactionStore.contractType">
    <option v-for="contract of possibleContract" :key="contract.value" :value="contract.value">{{contract.name}}</option>
  </select>
  -->

  <IntInput
    label="Arc200 appID"
    v-model="parameterStore.arc200AppID"
    v-if="transactionStore.conventionType === CONVENTION_TYPE.Arc200Arc72 ||
    transactionStore.conventionType === CONVENTION_TYPE.Arc200Rwa"
  />

  <template
    v-if="transactionStore.conventionType === CONVENTION_TYPE.Arc200Arc72 ||
          transactionStore.conventionType ===CONVENTION_TYPE.VoiArc72">
    <IntInput
      label="Arc72 id"
      v-model="parameterStore.nftID"
    />
    <IntInput
      label="Arc72 appID"
      v-model="parameterStore.nftAppID"
    />
  </template>


  <template
    v-if="transactionStore.contractType === CONTRACT_TYPE.Auction ||
          transactionStore.contractType === CONTRACT_TYPE.Dutch"
  >
    <IntInput v-model="parameterStore.priceMin" label="Minimum price"/>
    <IntInput v-model="parameterStore.priceMax" :min="parameterStore.priceMin + 1" label="Maximum price" v-if="transactionStore.contractType === CONTRACT_TYPE.Dutch"/>
    <IntInput v-model="parameterStore.duration" label="Duration (in hours)"/>
  </template>

  <template v-if="transactionStore.contractType === CONTRACT_TYPE.Sale">
    <template
      v-if="transactionStore.conventionType === CONVENTION_TYPE.VoiRwa ||
          transactionStore.conventionType ===CONVENTION_TYPE.Arc200Rwa">
      <TextInput
        v-model="parameterStore.rwaId"
        label="RWA ID"
      />
      <TextInput
        v-model="parameterStore.rwaName"
        label="RWA Name"
      />
    </template>

    <IntInput
      label="Sell price"
      v-model="parameterStore.price"/>
  </template>
  <button
    class="ap-flex ap-items-center ap-justify-center ap-w-[150px] ap-rounded-lg ap-bg-blue-700 ap-px-5 ap-py-2.5 ap-text-center ap-text-sm ap-font-medium ap-text-white hover:ap-bg-blue-800 focus:ap-outline-none focus:ap-ring-4 focus:ap-ring-blue-300 dark:ap-bg-blue-600 dark:ap-hover:bg-blue-700 dark:focus:ap-ring-blue-800"
    @click="transactionStore.doTransaction()">Create</button>
</template>

<script setup>
import {useTransactionStore} from '@/stores/transactionStore'
import {useParametersStore} from '@/stores/parametersStore'
import IntInput from '@/components/IntInput.vue'
import {CONTRACT_TYPE, CONVENTION_TYPE} from '@/constants/index'
import TextInput from '@/components/TextInput.vue'
import {computed} from 'vue'
import SelectInput from '@/components/SelectInput.vue'

const transactionStore = useTransactionStore()
const parameterStore = useParametersStore()

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
  transactionStore.contractType = t[0].value
  return t
})
</script>

<style scoped>

</style>
