<script lang="ts" setup>
import {type HTMLAttributes} from 'vue'
import {cn} from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
      :class="cn('ap-text-foreground ap-flex ap-flex-col ap-gap-y-1.5 ap-text-center md:ap-text-left', props.class)"
  >
    <slot/>
  </div>
</template>
