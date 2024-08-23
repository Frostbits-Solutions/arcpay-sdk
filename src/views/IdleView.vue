<script setup lang="ts">
import TestView from '@/views/TestView.vue'

const debug = !!import.meta.env.VITE_DEBUG_API_KEY
</script>

<template>
  <TestView v-if="debug"/>
  <div v-else><!-- arcpay loaded --></div>
</template>

<style scoped>

</style>