<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { MagnifyingGlassIcon } from '@radix-icons/vue'
import { ComboboxInput, type ComboboxInputProps, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<ComboboxInputProps & {
  class?: HTMLAttributes['class']
}>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <div class="ap-flex ap-items-center ap-border-b ap-border-border ap-px-3" cmdk-input-wrapper>
    <MagnifyingGlassIcon class="ap-mr-2 ap-h-4 ap-w-4 ap-shrink-0 ap-opacity-50" />
    <ComboboxInput
      v-bind="{ ...forwardedProps, ...$attrs }"
      auto-focus
      :class="cn('ap-flex ap-h-10 ap-w-full ap-rounded-md ap-bg-transparent ap-py-3 ap-text-sm ap-outline-none placeholder:ap-text-muted-foreground disabled:ap-cursor-not-allowed disabled:ap-opacity-50', props.class)"
    />
  </div>
</template>
