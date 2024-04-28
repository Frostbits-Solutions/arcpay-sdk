<template>
  <div>
    <div class="loading-bar-container" :style="`width: ${maxBarWidth}px`">
      <div class="loading-bar" :style="barStyle"></div>
      <div class="shimmer" :style="shimmerStyle"></div>
    </div>
    {{ TRANSACTIONS_STEPS[transactionStore.transactionType][currentStep-1] }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {useTransactionStore} from "@/stores/transactionStore";
import {TRANSACTION_STATE, TRANSACTIONS_STEPS} from "@/constants";

const transactionStore = useTransactionStore()
const currentStep = computed(() => {
  switch (transactionStore.state) {
    case TRANSACTION_STATE.idle:
      return 0
    case TRANSACTION_STATE.initiatingTransaction:
      return 1
    case TRANSACTION_STATE.signingTransaction:
      return 2
    case TRANSACTION_STATE.sendingTransaction:
      return 3
    default:
      return 4
  }
})
const maxBarWidth = 200;
const animatedWidth = computed(() => maxBarWidth * (currentStep.value + 1) / 4 )

const barStyle = computed(() => ({
  width: `${animatedWidth.value}px`,
  backgroundColor: `rgb(${255 - animatedWidth.value * (255 / maxBarWidth)}, ${animatedWidth.value * (255 / maxBarWidth)}, 0)`,
  transition: 'width 0.5s ease-in-out, background-color 0.5s ease-in-out'
}));

const shimmerStyle = computed(() => ({
  width: `${animatedWidth.value}px`,
  transition: 'width 0.5s ease-in-out'
}));
</script>

  <style scoped>
  .loading-bar-container {
    height: 10px;
    border-radius: 10px;
    border: 1px solid var(--color-background-mute);
    margin: auto;
    overflow: hidden;
    position: relative;
    background-color: #f0f0f0;
  }

  .loading-bar, .shimmer {
    height: inherit;
    position: absolute;
  }

  .loading-bar {
    transition: width 0.5s ease-in-out;
  }

  .shimmer {
    background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 100%);
    animation: shimmer 3s infinite;
    transition: width 0.5s ease-in-out;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  </style>
