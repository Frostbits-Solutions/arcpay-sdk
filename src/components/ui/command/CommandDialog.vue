<script lang="ts" setup>
import type {DialogRootEmits, DialogRootProps} from 'radix-vue'
import {useForwardPropsEmits} from 'radix-vue'
import Command from './Command.vue'
import {Dialog, DialogContent} from '@/components/ui/dialog'

const props = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <Dialog v-bind="forwarded">
    <DialogContent class="ap-overflow-hidden ap-p-0 ap-shadow-lg">
      <Command
          class="[&_[cmdk-group-heading]]:ap-px-2 [&_[cmdk-group-heading]]:ap-font-medium [&_[cmdk-group-heading]]:ap-text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:ap-pt-0 [&_[cmdk-group]]:ap-px-2 [&_[cmdk-input-wrapper]_svg]:ap-h-5 [&_[cmdk-input-wrapper]_svg]:ap-w-5 [&_[cmdk-input]]:ap-h-12 [&_[cmdk-item]]:ap-px-2 [&_[cmdk-item]]:ap-py-3 [&_[cmdk-item]_svg]:ap-h-5 [&_[cmdk-item]_svg]:ap-w-5">
        <slot/>
      </Command>
    </DialogContent>
  </Dialog>
</template>
