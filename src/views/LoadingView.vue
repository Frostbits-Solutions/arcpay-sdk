<script lang="ts" setup>
import {computed, inject, type Ref} from 'vue'

interface LoadProvider {
  args: {
    title: string
    description: string
  }
}

const loadProvider = inject<{ Load: Ref<LoadProvider> }>('appProvider')?.['Load']
const title = computed(() => loadProvider?.value.args?.title || 'Loading')
const description = computed(() => loadProvider?.value.args?.description || 'Sit tight.')
</script>

<template>
  <div class="ap-flex ap-flex-col ap-w-[333px] ap-h-[400px] ap-mx-auto">
    <div class="ap-flex-1 ap-flex ap-items-end ap-justify-center ap-pb-4">
      <div style="transform: translate(6px, -5px)">
        <svg class="spinner" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gradient">
              <stop offset="0%" stop-color="rgb(65, 88, 208)"/>
              <stop offset="30%" stop-color="rgb(200, 80, 192)"/>
              <stop offset="100%" stop-color="rgb(255, 204, 112)"/>
            </linearGradient>
          </defs>
          <circle class="spinner__circle" cx="26" cy="26" fill="none" r="25"/>
        </svg>
      </div>
    </div>
    <div
        class="ap-w-full ap-flex-1 ap-pt-4 ap-text-center ap-flex ap-flex-col ap-items-center ap-gap-2 ap-justify-between ap-animate-in ap-slide-in-from-bottom-2 ap-fade-in ap-delay-75 ap-fill-mode-both ap-animate-out ap-slide-out-to-top-2">
      <div>
        <div v-if="title" class="ap-text-md ap-font-semibold ap-text-foreground">{{ title }}</div>
        <div v-if="description" class="ap-text-xs ap-text-muted-foreground ap-whitespace-pre-line">{{ description }}
        </div>
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
  position: relative;
  top: 5px;
  right: 5px;
  margin: 0 auto;
}

.spinner__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: url(#gradient);
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