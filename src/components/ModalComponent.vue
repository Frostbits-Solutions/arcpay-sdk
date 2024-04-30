<script setup lang="ts">
import { defineProps, ref, onMounted } from 'vue'
import { useModalsStore } from '@/stores/modalsStore'

const props = defineProps({
  modalName: String,
})
const modals = useModalsStore()
const modalRef = ref<HTMLElement | null>(null)

function hide() {
  modals.hideModal(props.modalName)
}

onMounted(() => {
  modals.registerModal(props.modalName)
})
</script>

<template>
  <div v-if="modalName && modals.states[modalName]" @click="hide" tabindex="-1" class="ap-overflow-y-auto ap-overflow-x-hidden ap-flex ap-justify-center ap-items-center ap-fixed ap-top-0 ap-right-0 ap-left-0 ap-z-50 ap-w-full md:ap-inset-0 ap-h-full ap-backdrop-blur-sm ap-bg-gray-300/50 dark:ap-bg-gray-900/80 ap-animate-blur">
    <div @click.stop="" class="ap-relative ap-w-full ap-max-w-md ap-max-h-full">
      <!-- Modal content -->
      <div ref="modalRef" class="ap-relative ap-bg-white ap-rounded-lg ap-shadow dark:ap-bg-gray-700 ap-animate-modal ap-pb-8 ">
        <!-- Modal header -->
        <div class="ap-flex ap-items-center ap-justify-between ap-p-4 ap-md:p-5 ap-rounded-t">
          <slot name="header"></slot>
          <button @click="hide" type="button" class="ap-text-gray-400 ap-bg-transparent hover:ap-bg-gray-200 hover:ap-text-gray-900 ap-rounded-lg ap-text-sm ap-w-8 ap-h-8 ap-ms-auto ap-inline-flex ap-justify-center ap-items-center dark:hover:ap-bg-gray-600 dark:hover:ap-text-white">
            <svg class="ap-w-3 ap-h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="ap-sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="ap-px-8">
          <slot name="body" @close="hide"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
