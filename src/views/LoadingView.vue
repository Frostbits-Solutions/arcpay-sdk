<script setup lang="ts">
import { inject } from 'vue'
interface LoadProvider {
  args: {
    title: string
    description: string
  }
}
const { args } = inject<{Load: LoadProvider}>('appProvider')?.['Load'] || {}
</script>

<template>
  <div class="ap-flex ap-flex-col ap-w-[333px] ap-h-[400px]">
    <div class="ap-flex-1 ap-flex ap-items-end ap-pb-4">
      <svg class="spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle class="spinner__circle" cx="26" cy="26" r="25" fill="none" />
      </svg>
    </div>
    <div class="ap-w-full ap-flex-1 ap-pt-4 ap-text-center ap-flex ap-flex-col ap-items-center ap-gap-2 ap-justify-between ap-animate-in ap-slide-in-from-bottom-2 ap-fade-in ap-delay-75 ap-fill-mode-both">
      <div>
        <div v-if="args?.title" class="ap-text-md ap-font-semibold ap-text-foreground">{{args.title}}</div>
        <div v-if="args?.description" class="ap-text-xs ap-text-muted-foreground">{{args.description}}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spinner {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: block;
  position:relative;
  top: 5px;
  right: 5px;
  margin: 0 auto;
}
.spinner__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: hsl(var(--primary));
  fill: hsl(var(--background));
  animation: stroke .6s linear forwards, rotate 0.9s linear .6s infinite;
  transform-origin: 50% 50%;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 25;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
</style>