<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div
    :class="
      cn(
        'ap-flex ap-flex-col-reverse sm:ap-flex-row sm:ap-justify-end sm:ap-gap-x-2',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
