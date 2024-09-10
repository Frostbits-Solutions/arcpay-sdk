<script lang="ts" setup>
import type {HTMLAttributes} from 'vue'
import {cn} from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <span :class="cn('ap-ml-auto ap-text-xs ap-tracking-widest ap-text-muted-foreground', props.class)">
    <slot/>
  </span>
</template>
