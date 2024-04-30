<template>
  <button
    class="ap-flex ap-items-center ap-justify-center ap-rounded-lg ap-bg-blue-700 ap-px-5 ap-py-2.5 ap-text-center ap-text-sm ap-font-medium ap-text-white hover:ap-bg-blue-800 focus:ap-outline-none focus:ap-ring-4 focus:ap-ring-blue-300 dark:ap-bg-blue-600 dark:ap-hover:bg-blue-700 dark:focus:ap-ring-blue-800"
    @click="transactionStore.doTransaction()">Close</button>
</template>

<script setup>
import {useTransactionStore} from '@/stores/transactionStore'

const transactionStore = useTransactionStore()
</script>

<style scoped>

</style>
