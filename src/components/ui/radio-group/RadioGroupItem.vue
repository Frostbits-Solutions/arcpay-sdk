<script lang="ts" setup>
import {computed, type HTMLAttributes} from 'vue'
import {RadioGroupIndicator, RadioGroupItem, type RadioGroupItemProps, useForwardProps,} from 'radix-vue'
import {CheckIcon} from '@radix-icons/vue'
import {cn} from '@/lib/utils'

const props = defineProps<RadioGroupItemProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const {class: _, ...delegated} = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <RadioGroupItem
      :class="
      cn(
        'ap-aspect-square ap-h-4 ap-w-4 ap-rounded-full ap-border ap-border-primary ap-text-primary ap-shadow focus:ap-outline-none focus-visible:ap-ring-1 focus-visible:ap-ring-ring disabled:ap-cursor-not-allowed disabled:ap-opacity-50',
        props.class,
      )
    "
      v-bind="forwardedProps"
  >
    <RadioGroupIndicator class="ap-flex ap-items-center ap-justify-center">
      <CheckIcon class="ap-h-3.5 ap-w-3.5 ap-fill-primary"/>
    </RadioGroupIndicator>
  </RadioGroupItem>
</template>
