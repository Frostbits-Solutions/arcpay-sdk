<script setup lang="ts">
import type { NumberFieldIncrementProps } from 'radix-vue'
import { NumberFieldIncrement, useForwardProps } from 'radix-vue'
import { type HTMLAttributes, computed } from 'vue'
import { Plus } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps<NumberFieldIncrementProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <NumberFieldIncrement data-slot="increment" v-bind="forwarded" :class="cn('ap-absolute ap-top-1/2 -ap-translate-y-1/2 ap-right-0 disabled:ap-cursor-not-allowed disabled:ap-opacity-20 ap-p-3', props.class)">
    <slot>
      <Plus class="ap-h-4 ap-w-4" />
    </slot>
  </NumberFieldIncrement>
</template>
