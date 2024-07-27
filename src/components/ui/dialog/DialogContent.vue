<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import {
  DialogClose,
  DialogContent,
  type DialogContentEmits,
  type DialogContentProps,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
} from 'radix-vue'
import { Cross2Icon } from '@radix-icons/vue'
import { cn } from '@/lib/utils'

const props = defineProps<DialogContentProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<DialogContentEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <DialogPortal disabled>
    <DialogOverlay
      class="ap-fixed ap-inset-0 ap-z-50 ap-bg-slate-100/80 dark:ap-bg-slate-900/80 ap-backdrop-blur-md data-[state=open]:ap-animate-in data-[state=closed]:ap-animate-out data-[state=closed]:ap-fade-out-0 data-[state=open]:ap-fade-in-0"
    >
      <div class="ap-absolute ap-bottom-0 ap-text-muted-foreground ap-text-xs ap-p-4 ap-flex ap-justify-center ap-w-full">
        Powered by<img src="@/assets/logo.png" alt="Arcpay logo" class="ap-w-4 ap-h-4 ap-ml-1 ap-mr-0.5"/>arcpay.
      </div>
    </DialogOverlay>
    <DialogContent
      v-bind="forwarded"
      :class="
        cn(
          'ap-fixed ap-left-1/2 ap-top-1/2 ap-z-50 ap-table ap--translate-x-1/2 ap--translate-y-1/2 ap-border ap-border-border ap-bg-background ap-p-6 ap-shadow-lg ap-duration-200 data-[state=open]:ap-animate-in data-[state=closed]:ap-animate-out data-[state=closed]:ap-fade-out-0 data-[state=open]:ap-fade-in-0 data-[state=closed]:ap-zoom-out-95 data-[state=open]:ap-zoom-in-95 data-[state=closed]:ap-slide-out-to-left-1/2 data-[state=closed]:ap-slide-out-to-top-[48%] data-[state=open]:ap-slide-in-from-left-1/2 data-[state=open]:ap-slide-in-from-top-[48%] sm:ap-rounded-lg ap-transition-all',
          props.class,
        )"
    >
      <slot />

      <DialogClose
        class="ap-absolute ap-right-4 ap-top-4 ap-rounded-sm ap-opacity-70 ring-offset-background ap-transition-opacity hover:ap-opacity-100 focus:ap-outline-none disabled:ap-pointer-events-none data-[state=open]:ap-bg-accent data-[state=open]:ap-text-muted-foreground"
      >
        <Cross2Icon class="ap-w-4 ap-h-4" />
        <span class="ap-sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
