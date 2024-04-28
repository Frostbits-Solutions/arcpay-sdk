<template>
  <IntInput
    v-model="parameterStore.arc200AppID"
    v-if="transactionStore.conventionType === CONVENTION_TYPE.Arc200Arc72 ||
    transactionStore.conventionType === CONVENTION_TYPE.Arc200Rwa"
  />

  <template
    v-if="transactionStore.conventionType === CONVENTION_TYPE.VoiRwa ||
          transactionStore.conventionType ===CONVENTION_TYPE.Arc200Rwa">
    <TextInput
      v-model="parameterStore.rwaName"
    />
    <TextInput
      v-model="parameterStore.rwaDescription"
    />
  </template>

  <IntInput
    label="Sell price"
    v-model="parameterStore.price"/>
  <button @click="transactionStore.doTransaction()">Create</button>
</template>

<script setup>
import {useTransactionStore} from '@/stores/transactionStore'
import {useParametersStore} from '@/stores/parametersStore'
import {CONVENTION_TYPE} from '@/constants/index'
import IntInput from '@/components/IntInput.vue'
import TextInput from '@/components/TextInput.vue'

const transactionStore = useTransactionStore()
const parameterStore = useParametersStore()

</script>

<style scoped>

</style>
