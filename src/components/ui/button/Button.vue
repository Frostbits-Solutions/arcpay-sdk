<script lang="ts" setup>
import type {HTMLAttributes} from 'vue'
import {Primitive, type PrimitiveProps} from 'radix-vue'
import {type ButtonVariants, buttonVariants} from '.'
import {cn} from '@/lib/utils'

interface Props extends /* @vue-ignore */ PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})
</script>

<template>
  <Primitive
      :as="props.as"
      :as-child="props.asChild"
      :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot/>
  </Primitive>
</template>
