<script lang="ts" setup>
import {computed, type HTMLAttributes} from 'vue'
import type {ComboboxGroupProps} from 'radix-vue'
import {ComboboxGroup, ComboboxLabel} from 'radix-vue'
import {cn} from '@/lib/utils'

const props = defineProps<ComboboxGroupProps & {
  class?: HTMLAttributes['class']
  heading?: string
}>()

const delegatedProps = computed(() => {
  const {class: _, ...delegated} = props

  return delegated
})
</script>

<template>
  <ComboboxGroup
      :class="cn('ap-overflow-hidden ap-p-1 ap-text-foreground [&_[cmdk-group-heading]]:ap-px-2 [&_[cmdk-group-heading]]:ap-py-1.5 [&_[cmdk-group-heading]]:ap-text-xs [&_[cmdk-group-heading]]:ap-font-medium [&_[cmdk-group-heading]]:ap-text-muted-foreground', props.class)"
      v-bind="delegatedProps"
  >
    <ComboboxLabel v-if="heading" class="ap-px-2 ap-py-1.5 ap-text-xs ap-font-medium ap-text-muted-foreground">
      {{ heading }}
    </ComboboxLabel>
    <slot/>
  </ComboboxGroup>
</template>
