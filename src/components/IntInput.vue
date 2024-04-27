<template>
  <div class="w-full grid grid-cols-2 gap-x-4">
    <label
      v-if="label"
      for="`int-input-${label}`"
      class="self-center text-sm font-medium text-right text-gray-900 dark:text-white">
      {{label}}
    </label>
    <input
      type="number"
      :name="`int-input-${label}`"
      :value="modelValue"
      :min="min || 0"
      :max="max || Infinity"
      @input="emit('update:modelValue', $event.target.value)"
      class="rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
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
