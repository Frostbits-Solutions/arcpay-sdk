<script lang="ts" setup>
import {computed, type HTMLAttributes} from 'vue'
import {Label, type LabelProps} from 'radix-vue'
import {cn} from '@/lib/utils'

const props = defineProps<LabelProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const {class: _, ...delegated} = props

  return delegated
})
</script>

<template>
  <Label
      :class="
      cn(
        'ap-text-sm ap-font-medium ap-leading-none peer-disabled:ap-cursor-not-allowed peer-disabled:ap-opacity-70',
        props.class,
      )
    "
      v-bind="delegatedProps"
  >
    <slot/>
  </Label>
</template>
