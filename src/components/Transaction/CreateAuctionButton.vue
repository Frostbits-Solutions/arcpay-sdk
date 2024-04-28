<template>
  <IntInput v-model="parameterStore.reserve"/>
  <IntInput v-model="parameterStore.duration"/>
  <button @click="transactionStore.doTransaction()">Create</button>
</template>

<script setup>
import {useTransactionStore} from '@/stores/transactionStore'
import {useParametersStore} from '@/stores/parametersStore'
import IntInput from '@/components/IntInput.vue'

const transactionStore = useTransactionStore()
const parameterStore = useParametersStore()
</script>

<style scoped>

</style>
