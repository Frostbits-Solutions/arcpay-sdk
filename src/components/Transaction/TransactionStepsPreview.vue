<template>
  <div>
    <div class="loading-bar-container" :style="`width: ${maxBarWidth}px`">
      <div class="loading-bar" :style="barStyle"></div>
      <div class="shimmer" :style="shimmerStyle"></div>
    </div>
    {{ steps[currentStep] }}
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  steps: Array<string>,
  currentStep: number
}>()

const maxBarWidth = 200;
const animatedWidth = ref(maxBarWidth * (props.currentStep + 1) / props.steps.length );

const barStyle = computed(() => ({
  width: `${animatedWidth.value}px`,
  backgroundColor: `rgb(${255 - animatedWidth.value * (255 / maxBarWidth)}, ${animatedWidth.value * (255 / maxBarWidth)}, 0)`,
  transition: 'width 0.5s ease-in-out, background-color 0.5s ease-in-out'
}));

const shimmerStyle = computed(() => ({
  width: `${animatedWidth.value}px`,
  transition: 'width 0.5s ease-in-out'
}));

// Update the width whenever currentStep changes
watch(
  () => props.currentStep,
  (newStep) => {
    animatedWidth.value = maxBarWidth * (newStep + 1) / (props.steps.length - 1);// Because the status bar never reaches full because it jumps right into message I subtracted 1. This can be removed when finalizing the UI and displaying a complete status bar and the done/complete message.
  },
  { immediate: true }
);
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
  