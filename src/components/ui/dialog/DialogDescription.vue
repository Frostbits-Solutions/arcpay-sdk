<script lang="ts" setup>
import {computed, type HTMLAttributes} from 'vue'
import {DialogDescription, type DialogDescriptionProps, useForwardProps} from 'radix-vue'
import {cn} from '@/lib/utils'

const props = defineProps<DialogDescriptionProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const {class: _, ...delegated} = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <DialogDescription
      :class="cn('ap-text-sm ap-text-muted-foreground', props.class)"
      v-bind="forwardedProps"
  >
    <slot/>
  </DialogDescription>
</template>
