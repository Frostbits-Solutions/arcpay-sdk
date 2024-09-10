<script lang="ts" setup>
import type {HTMLAttributes} from 'vue'
import {cn} from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
      :class="cn('ap-relative [&>[data-slot=input]]:has-[[data-slot=increment]]:ap-pr-5 [&>[data-slot=input]]:has-[[data-slot=decrement]]:ap-pl-5', props.class)">
    <slot/>
  </div>
</template>
