<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import type { ComboboxItemEmits, ComboboxItemProps } from 'radix-vue'
import { ComboboxItem, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<ComboboxItemProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<ComboboxItemEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ComboboxItem
    v-bind="forwarded"
    :class="cn('ap-relative ap-flex ap-cursor-default ap-select-none ap-items-center ap-rounded-sm ap-px-2 ap-py-1.5 ap-text-sm ap-outline-none data-[highlighted]:ap-bg-accent data-[highlighted]:ap-text-accent-foreground data-[disabled]:ap-pointer-events-none data-[disabled]:ap-opacity-50', props.class)"
  >
    <slot />
  </ComboboxItem>
</template>
