<script lang="ts" setup>
import {computed, type HTMLAttributes} from 'vue'
import {ScrollAreaScrollbar, type ScrollAreaScrollbarProps, ScrollAreaThumb} from 'radix-vue'
import {cn} from '@/lib/utils'

const props = withDefaults(defineProps<ScrollAreaScrollbarProps & { class?: HTMLAttributes['class'] }>(), {
  orientation: 'vertical',
})

const delegatedProps = computed(() => {
  const {class: _, ...delegated} = props

  return delegated
})
</script>

<template>
  <ScrollAreaScrollbar
      :class="
      cn('ap-flex ap-touch-none ap-select-none ap-transition-colors',
         orientation === 'vertical'
           && 'ap-h-full ap-w-2.5 ap-border-l ap-border-l-transparent ap-p-px',
         orientation === 'horizontal'
           && 'ap-h-2.5 ap-flex-col ap-border-t ap-border-t-transparent ap-p-px',
         props.class)"
      v-bind="delegatedProps"
  >
    <ScrollAreaThumb class="ap-relative ap-flex-1 ap-rounded-full ap-bg-border"/>
  </ScrollAreaScrollbar>
</template>
