<script setup lang="ts">
import { inject } from 'vue'
import { Button } from '@/components/ui/button'

interface ErrorProvider {
  callback: (() => void)
  args: {
    title: string
    description: string
  }
}

const { callback, args } = inject<{ Error: ErrorProvider }>('appProvider')?.['Error'] || {}
</script>

<template>
  <div class="ap-flex ap-flex-col ap-w-[333px] ap-h-[400px] ap-mx-auto">
    <div class="ap-flex-1 ap-flex ap-items-end ap-justify-center ap-pb-4">
      <div style="transform: translate(6px, -5px)">
        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <defs>
            <linearGradient id="gradient">
              <stop offset="0%" stop-color="rgb(65, 88, 208)" />
              <stop offset="30%" stop-color="rgb(200, 80, 192)" />
              <stop offset="100%" stop-color="rgb(255, 204, 112)" />
            </linearGradient>
          </defs>
          <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
          <path class="checkmark__check" fill="none" d="M16 16 36 36 M36 16 16 36" />
        </svg>
      </div>
    </div>
    <div class="ap-w-full ap-flex-1 ap-pt-4 ap-text-center ap-flex ap-flex-col ap-items-center ap-gap-2 ap-justify-between">
      <div class="ap-animate-in ap-slide-in-from-bottom-2 ap-fade-in ap-delay-75 ap-fill-mode-both">
        <div v-if="args?.title" class="ap-text-md ap-font-semibold ap-text-foreground">{{ args.title }}</div>
        <div v-if="args?.description" class="ap-text-xs ap-text-muted-foreground ap-break-all">{{ args.description }}</div>
      </div>
      <Button @click="callback" variant="secondary" size="lg" class="ap-mb-8 ap-grow-0 ap-w-24 ap-bg-background">Close</Button>
    </div>
  </div>
</template>

<style scoped>
.checkmark {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: url(#gradient);
  stroke-miterlimit: 10;
  animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
  position: relative;
  top: 5px;
  right: 5px;
  margin: 0 auto;
}

.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: url(#gradient);
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes scale {
  0%, 100% {
    transform: none;
  }

  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}
</style>