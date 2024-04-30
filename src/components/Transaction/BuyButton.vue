<template>
  <IntInput v-model="parameterStore.price" v-if="transactionStore.contractType === CONTRACT_TYPE.Dutch"/>
  <button
    class="ap-flex ap-items-center ap-justify-center ap-rounded-lg ap-bg-blue-700 ap-px-5 ap-py-2.5 ap-text-center ap-text-sm ap-font-medium ap-text-white hover:ap-bg-blue-800 focus:ap-outline-none focus:ap-ring-4 focus:ap-ring-blue-300 dark:ap-bg-blue-600 dark:ap-hover:bg-blue-700 dark:focus:ap-ring-blue-800"
    @click="transactionStore.doTransaction()">Buy</button>
</template>

<script setup>
import {useTransactionStore} from '@/stores/transactionStore'
import {CONTRACT_TYPE} from '@/constants/index'
import {useParametersStore} from '@/stores/parametersStore'
import IntInput from '@/components/IntInput.vue'

const transactionStore = useTransactionStore()
const parameterStore = useParametersStore()
</script>

<style scoped>

</style>
