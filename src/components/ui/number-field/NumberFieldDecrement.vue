<script lang="ts" setup>
import type {NumberFieldDecrementProps} from 'radix-vue'
import {NumberFieldDecrement, useForwardProps} from 'radix-vue'
import {computed, type HTMLAttributes} from 'vue'
import {Minus} from 'lucide-vue-next'
import {cn} from '@/lib/utils'

const props = defineProps<NumberFieldDecrementProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const {class: _, ...delegated} = props

  return delegated
})

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <NumberFieldDecrement :class="cn('ap-absolute ap-top-1/2 -ap-translate-y-1/2 ap-left-0 ap-p-3 disabled:ap-cursor-not-allowed disabled:ap-opacity-20', props.class)" data-slot="decrement"
                        v-bind="forwarded">
    <slot>
      <Minus class="ap-h-4 ap-w-4"/>
    </slot>
  </NumberFieldDecrement>
</template>
