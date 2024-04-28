<template>
  <IntInput
    v-model="parameterStore.arc200AppID"
    label="Arc200 application id"
    v-if="transactionStore.conventionType === CONVENTION_TYPE.Arc200Arc72 || CONVENTION_TYPE.Arc200Rwa"/>
  <IntInput v-model="parameterStore.priceMin" :max="parameterStore.priceMax - 1" label="Minimum price"/>
  <IntInput v-model="parameterStore.priceMax" :min="parameterStore.priceMin + 1" label="Maximum price"/>
  <IntInput v-model="parameterStore.duration" label="Duration (in hours)"/>
  <button @click="transactionStore.doTransaction()">Create</button>
</template>

<script setup>
import {useTransactionStore} from '@/stores/transactionStore'
import {useParametersStore} from '@/stores/parametersStore'
import IntInput from '@/components/IntInput.vue'
import {CONVENTION_TYPE} from '@/constants/index'

const transactionStore = useTransactionStore()
const parameterStore = useParametersStore()
</script>

<style scoped>

</style>
