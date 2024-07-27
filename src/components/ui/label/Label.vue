<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { Label, type LabelProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<LabelProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <Label
    v-bind="delegatedProps"
    :class="
      cn(
        'ap-text-sm ap-font-medium ap-leading-none peer-disabled:ap-cursor-not-allowed peer-disabled:ap-opacity-70',
        props.class,
      )
    "
  >
    <slot />
  </Label>
</template>
