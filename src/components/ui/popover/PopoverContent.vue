<script lang="ts" setup>
import {computed, type HTMLAttributes} from 'vue'
import {
  PopoverContent,
  type PopoverContentEmits,
  type PopoverContentProps,
  PopoverPortal,
  useForwardPropsEmits,
} from 'radix-vue'
import {cn} from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
    defineProps<PopoverContentProps & { class?: HTMLAttributes['class'] }>(),
    {
      align: 'center',
      sideOffset: 4,
    },
)
const emits = defineEmits<PopoverContentEmits>()

const delegatedProps = computed(() => {
  const {class: _, ...delegated} = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <PopoverPortal disabled>
    <PopoverContent
        :class="
        cn(
          'ap-z-50 ap-w-72 ap-rounded-md ap-border ap-border-border ap-bg-popover ap-p-4 ap-text-popover-foreground ap-shadow-md ap-outline-none data-[state=open]:ap-animate-in data-[state=closed]:ap-animate-out data-[state=closed]:ap-fade-out-0 data-[state=open]:ap-fade-in-0 data-[state=closed]:ap-zoom-out-95 data-[state=open]:ap-zoom-in-95 data-[side=bottom]:ap-slide-in-from-top-2 data-[side=left]:ap-slide-in-from-right-2 data-[side=right]:ap-slide-in-from-left-2 data-[side=top]:ap-slide-in-from-bottom-2',
          props.class,
        )
      "
        v-bind="{ ...forwarded, ...$attrs }"
    >
      <slot/>
    </PopoverContent>
  </PopoverPortal>
</template>
