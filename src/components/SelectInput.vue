<template>
  <div class="ap-w-[60%] ap-grid ap-grid-cols-[150px_auto] ap-gap-x-4">
    <label
      v-if="label"
      class="ap-self-center ap-text-sm ap-font-medium ap-text-right ap-text-gray-900 dark:ap-text-white">
      {{label}}
    </label>
    <select
      @input="emit('update:modelValue', $event.target.value)"
      class="ap-rounded-lg ap-border ap-border-gray-300 ap-bg-gray-50 ap-p-2.5 ap-text-sm ap-text-gray-900 focus:ap-border-blue-500 focus:ap-ring-blue-500 dark:ap-border-gray-500 dark:ap-bg-gray-600 dark:ap-text-white dark:ap-placeholder-gray-400">
      <option v-for="option of options" :key="option.name" :value="option.value">{{option.name}}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: any,
  label?:string,
  options: Array<{name: string, value: any}>,
}>()
const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>

</style>
