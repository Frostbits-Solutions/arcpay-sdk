<template>
  <button @click="transactionStore.doTransaction()">Buy</button>
</template>

<script setup>
import {useTransactionStore} from '@/stores/transactionStore'

const transactionStore = useTransactionStore()
</script>

<style scoped>

</style>
