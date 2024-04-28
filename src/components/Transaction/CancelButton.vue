<template>
  <button @click="transactionStore.doTransaction()">Cancel</button>
</template>

<script setup>
import {useTransactionStore} from '@/stores/transactionStore'

const transactionStore = useTransactionStore()
</script>

<style scoped>

</style>
