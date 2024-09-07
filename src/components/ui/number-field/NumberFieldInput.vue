<script setup lang="ts">
import { NumberFieldInput } from 'radix-vue'
import { cn } from '@/lib/utils'
</script>

<template>
  <NumberFieldInput data-slot="input" :class="cn('ap-flex ap-h-10 ap-w-full ap-rounded-md ap-border ap-border-input ap-bg-background ap-py-1 ap-text-sm ap-text-center ap-shadow-sm ap-transition-colors placeholder:ap-text-muted-foreground focus-visible:ap-outline-none focus-visible:ap-ring-1 focus-visible:ap-ring-ring disabled:ap-cursor-not-allowed disabled:ap-opacity-50')" />
</template>
