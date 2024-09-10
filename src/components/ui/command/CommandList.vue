<script lang="ts" setup>
import {computed, type HTMLAttributes} from 'vue'
import type {ComboboxContentEmits, ComboboxContentProps} from 'radix-vue'
import {ComboboxContent, useForwardPropsEmits} from 'radix-vue'
import {cn} from '@/lib/utils'
import {ScrollArea} from '@/components/ui/scroll-area'

const props = withDefaults(defineProps<ComboboxContentProps & { class?: HTMLAttributes['class'] }>(), {
  dismissable: false,
})
const emits = defineEmits<ComboboxContentEmits>()

const delegatedProps = computed(() => {
  const {class: _, ...delegated} = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ComboboxContent :class="cn('ap-overflow-x-hidden', props.class)" v-bind="forwarded">
    <ScrollArea class="ap-h-[300px]">
      <div role="presentation">
        <slot/>
      </div>
    </ScrollArea>
  </ComboboxContent>
</template>
