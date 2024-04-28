<script setup lang="ts">
import { defineProps, ref, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useModalsStore } from '@/stores/modalsStore'

const props = defineProps({
  modalName: String,
})
const modals = useModalsStore()
const modalRef = ref<HTMLElement | null>(null)

function hide() {
  modals.hideModal(props.modalName)
}

onClickOutside(modalRef, () => hide())

onMounted(() => {
  modals.registerModal(props.modalName)
})
</script>

<template>
  <div v-if="modalName && modals.states[modalName]" tabindex="-1" class="overflow-y-auto overflow-x-hidden flex justify-center items-center fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-full backdrop-blur-sm bg-gray-300/50 dark:bg-gray-900/80 animate-blur">
    <div class="relative p-4 w-full max-w-md max-h-full">
      <!-- Modal content -->
      <div ref="modalRef" class="relative bg-white rounded-lg shadow dark:bg-gray-700 animate-modal">
        <!-- Modal header -->
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <slot name="header"></slot>
          <button @click="hide" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <slot name="body" @close="hide"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>