<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
    <input v-model="modelValue" :class="cn('ap-flex ap-h-9 ap-w-full ap-rounded-md ap-border ap-border-input ap-bg-background ap-px-3 ap-py-1 ap-text-sm ap-shadow-sm ap-transition-colors file:ap-border-0 file:ap-bg-transparent file:ap-text-sm file:ap-font-medium placeholder:ap-text-muted-foreground focus-visible:ap-outline-none focus-visible:ap-ring-1 focus-visible:ap-ring-ring disabled:ap-cursor-not-allowed disabled:ap-opacity-50', props.class)">
</template>

