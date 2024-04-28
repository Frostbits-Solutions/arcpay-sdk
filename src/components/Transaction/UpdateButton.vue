<template>
  <IntInput v-model="parameterStore.price"/>
  <button @click="transactionStore.doTransaction()">Update</button>
</template>

<script setup>
import {useTransactionStore} from '@/stores/transactionStore'
import IntInput from '@/components/IntInput.vue'
import {useParametersStore} from '@/stores/parametersStore'

const transactionStore = useTransactionStore()
const parameterStore = useParametersStore()
</script>

<style scoped>

</style>
