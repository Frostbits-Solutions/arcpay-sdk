<script lang="ts" setup>
import {computed, type HTMLAttributes} from 'vue'
import type {ComboboxRootEmits, ComboboxRootProps} from 'radix-vue'
import {ComboboxRoot, useForwardPropsEmits} from 'radix-vue'
import {cn} from '@/lib/utils'

const props = withDefaults(defineProps<ComboboxRootProps & { class?: HTMLAttributes['class'] }>(), {
  open: true,
  modelValue: '',
})

const emits = defineEmits<ComboboxRootEmits>()

const delegatedProps = computed(() => {
  const {class: _, ...delegated} = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ComboboxRoot
      :class="cn('ap-flex ap-h-full ap-w-full ap-flex-col ap-overflow-hidden ap-rounded-md ap-bg-popover ap-text-popover-foreground', props.class)"
      v-bind="forwarded"
  >
    <slot/>
  </ComboboxRoot>
</template>
