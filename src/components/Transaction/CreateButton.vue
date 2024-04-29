<template>
  <select v-model="transactionStore.conventionType">
    <option :value="CONVENTION_TYPE.VoiArc72">Voi -> Arc72</option>
    <option :value="CONVENTION_TYPE.VoiRwa">Voi -> Rwa</option>
    <option :value="CONVENTION_TYPE.Arc200Arc72">Arc200 -> Arc72</option>
    <option :value="CONVENTION_TYPE.Arc200Rwa">Arc200 -> Rwa</option>
  </select>

  <select v-model="transactionStore.contractType">
    <option v-for="contract of possibleContract" :key="contract.value" :value="contract.value">{{contract.name}}</option>
  </select>

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


  <template v-if="transactionStore.contractType === CONTRACT_TYPE.Auction">
    <IntInput v-model="parameterStore.priceMin" label="min price"/>
    <IntInput v-model="parameterStore.duration" label="Duration (in hours)"/>
  </template>

  <template v-if="transactionStore.contractType === CONTRACT_TYPE.Dutch">
    <IntInput v-model="parameterStore.priceMin" :max="parameterStore.priceMax - 1" label="Minimum price"/>
    <IntInput v-model="parameterStore.priceMax" :min="parameterStore.priceMin + 1" label="Maximum price"/>
    <IntInput v-model="parameterStore.duration" label="Duration (in hours)"/>
  </template>

  <template v-if="transactionStore.contractType === CONTRACT_TYPE.Sale">
    <template
      v-if="transactionStore.conventionType === CONVENTION_TYPE.VoiRwa ||
          transactionStore.conventionType ===CONVENTION_TYPE.Arc200Rwa">
      <TextInput
        v-model="parameterStore.rwaId"
        label=""
      />
      <TextInput
        v-model="parameterStore.rwaName"
      />
    </template>

    <IntInput
      label="Sell price"
      v-model="parameterStore.price"/>
  </template>
  <button @click="transactionStore.doTransaction()">Create</button>
</template>

<script setup>
import {useTransactionStore} from '@/stores/transactionStore'
import {useParametersStore} from '@/stores/parametersStore'
import IntInput from '@/components/IntInput.vue'
import {CONTRACT_TYPE, CONVENTION_TYPE} from '@/constants/index'
import TextInput from '@/components/TextInput.vue'
import {computed} from 'vue'

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
