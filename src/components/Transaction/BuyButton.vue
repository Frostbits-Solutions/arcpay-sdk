<template>
  <template v-if="transactionStore.contractType === CONTRACT_TYPE.Dutch">
    <IntInput v-model="parameterStore.price" v-if="false"/>
    <div class="ap-grid ap-grid-cols-[150px_auto] ap-gap-x-4">
      <span
        class="ap-self-center ap-text-sm ap-font-medium ap-text-right ap-text-gray-900 dark:ap-text-white">
        Remaining time
      </span>
      <span
        class="ap-self-center ap-text-sm ap-font-medium ap-text-left ap-text-gray-900 dark:ap-text-white">
        {{msToTime(remainingTime)}}
      </span>
    </div>
    <div class="ap-grid ap-grid-cols-[150px_auto] ap-gap-x-4">
      <span
        class="ap-self-center ap-text-sm ap-font-medium ap-text-right ap-text-gray-900 dark:ap-text-white">
        Current price
      </span>
      <span
        class="ap-self-center ap-text-sm ap-font-medium ap-text-left ap-text-gray-900 dark:ap-text-white">
        {{parameterStore.price}}VOI
      </span>
    </div>
  </template>
  <button
    class="ap-flex ap-items-center ap-justify-center ap-rounded-lg ap-bg-blue-700 ap-px-5 ap-py-2.5 ap-text-center ap-text-sm ap-font-medium ap-text-white hover:ap-bg-blue-800 focus:ap-outline-none focus:ap-ring-4 focus:ap-ring-blue-300 dark:ap-bg-blue-600 dark:ap-hover:bg-blue-700 dark:focus:ap-ring-blue-800"
    @click="transactionStore.doTransaction()">Buy</button>
</template>

<script setup>
import {useTransactionStore} from '@/stores/transactionStore'
import {CONTRACT_TYPE} from '@/constants/index'
import {useParametersStore} from '@/stores/parametersStore'
import IntInput from '@/components/IntInput.vue'
import {onMounted, ref} from 'vue'

const transactionStore = useTransactionStore()
const parameterStore = useParametersStore()

const remainingTime = ref(0)

function msToTime(duration) {
  let milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

function updateTime () {
  setTimeout( () => {
      if (parameterStore.endDate < Date.now()) {
        remainingTime.value = parameterStore.endDate - Date.now()
        updateTime()
      } else {
        remainingTime.value = 0
      }
    }
    , 1000)
}

onMounted(() => {
  if (transactionStore.contractType === CONTRACT_TYPE.Dutch) {
    updateTime ()
  }
})
</script>

<style scoped>

</style>
