<script lang="ts" setup>
import type {HTMLAttributes} from 'vue'
import {cn} from '@/lib/utils'

interface SkeletonProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<SkeletonProps>()
</script>

<template>
  <div :class="cn('ap-animate-pulse ap-rounded-md ap-bg-border', props.class)"/>
</template>
