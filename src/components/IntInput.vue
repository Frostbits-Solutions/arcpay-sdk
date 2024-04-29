<template>
  <div class="ap-w-[60%] ap-grid ap-grid-cols-[150px_auto] ap-gap-x-4">
    <label
      v-if="label"
      :for="`int-input-${label}`"
      class="ap-self-center ap-text-sm ap-font-medium ap-text-right ap-text-gray-900 dark:ap-text-white">
      {{label}}
    </label>
    <input
      type="number"
      :name="`int-input-${label}`"
      :value="modelValue"
      :min="min || 0"
      :max="max || Infinity"
      @input="emit('update:modelValue', Number($event.target.value))"
      class="ap-rounded-lg ap-border ap-border-gray-300 ap-bg-gray-50 ap-p-2.5 ap-text-sm ap-text-gray-900 focus:ap-border-blue-500 focus:ap-ring-blue-500 dark:ap-border-gray-500 dark:ap-bg-gray-600 dark:ap-text-white dark:ap-placeholder-gray-400"
      />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: number,
  label?: string,
  min?: number,
  max?: number,
}>()
const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>

</style>
