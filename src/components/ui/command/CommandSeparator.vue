<script lang="ts" setup>
import {computed, type HTMLAttributes} from 'vue'
import type {ComboboxSeparatorProps} from 'radix-vue'
import {ComboboxSeparator} from 'radix-vue'
import {cn} from '@/lib/utils'

const props = defineProps<ComboboxSeparatorProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const {class: _, ...delegated} = props

  return delegated
})
</script>

<template>
  <ComboboxSeparator
      :class="cn('-ap-mx-1 ap-h-px ap-bg-border', props.class)"
      v-bind="delegatedProps"
  >
    <slot/>
  </ComboboxSeparator>
</template>
