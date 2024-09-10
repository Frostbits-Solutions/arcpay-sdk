<script lang="ts" setup>
import {computed, type HTMLAttributes} from 'vue'
import type {ComboboxEmptyProps} from 'radix-vue'
import {ComboboxEmpty} from 'radix-vue'
import {cn} from '@/lib/utils'

const props = defineProps<ComboboxEmptyProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const {class: _, ...delegated} = props

  return delegated
})
</script>

<template>
  <ComboboxEmpty :class="cn('ap-py-6 ap-text-center ap-text-sm', props.class)" v-bind="delegatedProps">
    <slot/>
  </ComboboxEmpty>
</template>
